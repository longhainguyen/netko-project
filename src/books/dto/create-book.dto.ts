import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'The userName is required' })
  @IsString()
  title: string;

  @IsDate()
  publishedDate: Date;

  @IsArray()
  @IsNumber({}, { each: true })
  authorIds: number[];
}
