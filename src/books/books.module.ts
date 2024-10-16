import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { UserModule } from 'src/user/user.module';
import { AuthorBook } from 'src/author-books/author-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, AuthorBook]), UserModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
