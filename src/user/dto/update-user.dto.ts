import { OmitType, PartialType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(User) {}

export class UpdateUserFromCreateDto extends PartialType(
  OmitType(CreateUserDto, ['email']),
) {
  @ApiProperty()
  password?: string;
  @ApiProperty()
  username?: string;
}
