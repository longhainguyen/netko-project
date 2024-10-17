import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'The userName is required' })
  @IsString()
  name: string;

  @IsString()
  description: string;
}
