import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QueryBooksDto {
  @IsNotEmpty({ message: 'Published date is required' })
  @IsString()
  @ApiProperty()
  publishedDate: string;
}
