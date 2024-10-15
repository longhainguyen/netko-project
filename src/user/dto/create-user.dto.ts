import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
  'role',
  'authorBooks',
] as const) {
  @IsNotEmpty({ message: 'The userName is required' })
  @Length(3, 255)
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  password: string;

  @IsString()
  refreshToken: string;
}
