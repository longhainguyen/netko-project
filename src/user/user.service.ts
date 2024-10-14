import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRole } from 'src/constant/enum/role.enum';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findAll(): Promise<User[] | undefined> {
    return this.users;
  }
}
