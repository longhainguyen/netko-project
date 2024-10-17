import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthorBook } from '../../author-books/author-book.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  title: string;

  @Column({ type: 'date' })
  publishedDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => AuthorBook, (authorBook) => authorBook.book)
  authorBooks: AuthorBook[];

  @ManyToOne(() => Category, (category) => category.books)
  category: Category;
}
