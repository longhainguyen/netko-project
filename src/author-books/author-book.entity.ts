import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../books/entities/book.entity';

@Entity()
export class AuthorBook {
  @PrimaryGeneratedColumn()
  authorBookId: number;

  @ManyToOne(() => User, (user) => user.authorBooks)
  user: User;

  @ManyToOne(() => Book, (book) => book.authorBooks)
  book: Book;
}
