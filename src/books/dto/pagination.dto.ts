import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @ApiProperty()
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @ApiProperty()
  keyword: string = '';
}
