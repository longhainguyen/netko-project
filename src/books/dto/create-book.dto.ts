import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Book } from '../entities/book.entity';
import { Type } from 'class-transformer';

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
  @Type(() => Date)
  publishedDate: Date;

  @IsArray()
  @ApiProperty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  authorIds: number[];

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  categoryId: number;
}
