import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { EntityManager, In, Like, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { AuthorBook } from 'src/author-books/author-book.entity';
import { QueryBooksDto } from './dto/query-book.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,

    @InjectRepository(AuthorBook)
    private readonly authorBookRepository: Repository<AuthorBook>,

    private userService: UserService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    return await this.booksRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const authors = await this.userService.findByIds(
          createBookDto.authorIds,
        );

        const newBook = entityManager.create(Book, {
          title: createBookDto.title,
          publishedDate: createBookDto.publishedDate,
        });

        const savedBook = await entityManager.save(Book, newBook);

        const authorBooks = authors.map((author) => {
          return entityManager.create(AuthorBook, {
            user: author,
            book: savedBook,
          });
        });

        await entityManager.save(AuthorBook, authorBooks);
        return savedBook;
      },
    );
  }

  async findAllByPublishedDay(queryBooksDto: QueryBooksDto): Promise<Book[]> {
    const date = new Date(queryBooksDto.publishedDate);

    return await this.booksRepository
      .createQueryBuilder('book')
      .where('book.publishedDate = :date', {
        date: date,
      })
      .getMany();
  }

  async findOne(id: number): Promise<Book> {
    return await this.booksRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findAll(): Promise<Book[]> {
    return await this.booksRepository.find();
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const { authorIds, ...updateData } = updateBookDto;
    return await this.booksRepository.manager.transaction(
      async (entityManager) => {
        if (updateData.categoryId != null) {
          const category = await entityManager.findOne(Category, {
            where: { id: updateData.categoryId },
          });
          if (!category) {
            throw new NotFoundException(
              `Category with ID ${updateData.categoryId} not found`,
            );
          }
        }

        if (authorIds && authorIds.length > 0) {
          await this.userService.findByIds(authorIds);

          await entityManager
            .createQueryBuilder()
            .delete()
            .from(AuthorBook)
            .where('bookId = :bookId', { bookId: id })
            .execute();

          await entityManager
            .createQueryBuilder()
            .insert()
            .into(AuthorBook)
            .values(
              authorIds.map((authorId) => ({
                bookId: id,
                userId: authorId,
              })),
            )
            .execute();
        }

        return await entityManager.update(Book, id, updateData);
      },
    );
  }

  async remove(id: number) {
    await this.authorBookRepository
      .createQueryBuilder('authorBook')
      .leftJoinAndSelect('authorBook.book', 'book')
      .delete()
      .from(AuthorBook)
      .where('bookId = :bookId', { bookId: id })
      .execute();

    return await this.booksRepository
      .createQueryBuilder()
      .delete()
      .from(Book)
      .where('id = :id', { id: id })
      .execute();
  }

  async searchBooks(
    paginationDto: PaginationDto,
  ): Promise<{ data: Book[]; count: number }> {
    const skip =
      paginationDto.page & paginationDto.limit
        ? (+paginationDto.page - 1) * +paginationDto.limit
        : 0;

    const [data, total] = await this.booksRepository
      .createQueryBuilder()
      .select()
      .where('title ILIKE :keyword', { keyword: `%${paginationDto.keyword}%` })
      .orderBy('title', 'ASC')
      .skip(skip)
      .take(paginationDto.limit ? paginationDto.limit : 10)
      .getManyAndCount();

    return {
      data: data,
      count: total,
    };
  }
}
