import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends OmitType(User, [
  'id',
  'createdAt',
  'updatedAt',
  'role',
  'refreshToken',
  'authorBooks',
  'emailVerifiedAt',
  'authorBooks',
  'verifications',
] as const) {
  @IsNotEmpty({ message: 'The userName is required' })
  @Length(3, 255)
  @IsString()
  @ApiProperty({ description: 'Username of the user' })
  username: string;

  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @ApiProperty({ description: 'Password of the user' })
  password: string;

  @IsNotEmpty({ message: 'The email is required' })
  @IsString()
  @ApiProperty({ description: 'Email of the user' })
  email: string;
}
