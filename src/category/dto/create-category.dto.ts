import { IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../entities/category.entity';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto extends OmitType(Category, ['id', 'books']) {
  @IsNotEmpty({ message: 'The userName is required' })
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;
}
