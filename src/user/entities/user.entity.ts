import { Exclude } from 'class-transformer';
import { AuthorBook } from 'src/author-books/author-book.entity';
import { UserRole } from 'src/constant/enum/role.enum';
import { Verification } from 'src/verification/entities/verification.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, type: Date })
  emailVerifiedAt: Date;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => AuthorBook, (authorBook) => authorBook.user)
  authorBooks: AuthorBook[];

  @OneToMany(() => Verification, (verification) => verification.user)
  verifications: Verification[];
}
