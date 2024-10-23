import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiProperty()
  authorIds?: number[];
  @ApiProperty()
  categoryId?: number;
  @ApiProperty()
  publishedDate?: Date;
  @ApiProperty()
  title?: string;
}
