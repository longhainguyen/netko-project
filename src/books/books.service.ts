import { Injectable, Query } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { AuthorBook } from 'src/author-books/author-book.entity';
import { QueryBooksDto } from './dto/query-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,

    @InjectRepository(AuthorBook)
    private readonly authorBookRepository: Repository<AuthorBook>,

    private userService: UserService,
  ) {}

  async create(createBookDto: CreateBookDto) {
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

  async findAllByPublishedDay(queryBooksDto: QueryBooksDto) {
    const date = new Date(queryBooksDto.publishedDate);
    return await this.booksRepository
      .createQueryBuilder('book')
      .where('book.publishedDate = :date', { date })
      .getMany();
  }

  async findOne(id: number) {
    return await this.booksRepository.find({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return await this.booksRepository.update(id, updateBookDto);
  }

  async remove(id: number) {
    return await this.booksRepository
      .createQueryBuilder()
      .delete()
      .from(Book)
      .where('id = :id', { id: id })
      .execute();
  }
}
