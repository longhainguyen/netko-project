import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { Public } from 'src/decorators/public.decorator';

@Roles(UserRole.User)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRole.Admin)
  @UseInterceptors(ClassSerializerInterceptor)
  getAllUsers() {
    return this.userService.findAll();
  }

  @Post()
  @Roles(UserRole.Admin)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return plainToInstance(User, user);
  }
}
