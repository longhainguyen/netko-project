import { IsNotEmpty, IsString } from 'class-validator';

export class QueryBooksDto {
  @IsNotEmpty({ message: 'Published date is required' })
  @IsString()
  publishedDate: string;
}
