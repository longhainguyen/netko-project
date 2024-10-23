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
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
@ApiBearerAuth('JWT-auth')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a book' })
  @Roles(UserRole.Admin)
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
  @ApiOperation({ summary: 'Retrieve books by published day' })
  @Public()
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

  @Public()
  @Get('all-books')
  @ApiOperation({ summary: 'Retrieve books' })
  async findAll() {
    try {
      return await this.booksService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Unable to query book .',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Retrieve a books by ID' })
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
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update a book' })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    try {
      return this.booksService.update(+id, updateBookDto);
    } catch (error) {
      throw new Error(error.message || 'Book not found or category not found');
    }
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  remove(@Param('id') id: string) {
    try {
      return this.booksService.remove(+id);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Retrieve books by keyword' })
  getBooks(@Query() paginationDto: PaginationDto) {
    try {
      return this.booksService.searchBooks(paginationDto);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
