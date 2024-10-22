import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Book } from '../entities/book.entity';

export class CreateBookDto extends OmitType(Book, [
  'id',
  'updatedAt',
  'createdAt',
  'authorBooks',
  'category',
]) {
  @IsNotEmpty({ message: 'The userName is required' })
  @IsString()
  @ApiProperty()
  title: string;

  @IsDate()
  @ApiProperty()
  publishedDate: Date;

  @IsArray()
  @ApiProperty()
  @IsNumber({}, { each: true })
  authorIds: number[];
}
