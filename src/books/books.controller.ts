import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-book.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    try {
      return await this.booksService.create(createBookDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to create book. Please check the input data.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('published')
  async findAllByPublishedDay(@Query() queryBooksDto: QueryBooksDto) {
    try {
      return await this.booksService.findAllByPublishedDay(queryBooksDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to query book by published day.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.booksService.findOne(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to query book.',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    try {
      return this.booksService.update(+id, updateBookDto);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.booksService.remove(+id);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get()
  getBooks(@Query() paginationDto: PaginationDto) {
    try {
      return this.booksService.searchBooks(paginationDto);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
