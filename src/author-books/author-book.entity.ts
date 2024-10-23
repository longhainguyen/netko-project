import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Book } from '../books/entities/book.entity';

@Entity()
export class AuthorBook {
  @PrimaryGeneratedColumn()
  authorBookId: number;

  @Column()
  userId: number;

  @Column()
  bookId: number;

  @ManyToOne(() => User, (user) => user.authorBooks)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, (book) => book.authorBooks)
  @JoinColumn({ name: 'bookId' })
  book: Book;
}
