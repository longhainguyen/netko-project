import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRole } from 'src/constant/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly users: User[] = [];

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByIds(ids: number[]): Promise<User[]> {
    const users = await this.userRepository.findBy({ id: In(ids) });

    if (users.length !== ids.length) {
      const notFoundIds = ids.filter((id) => {
        if (
          !users.some((user) => {
            return user.id === +id;
          })
        ) {
          return id;
        }
      });
      throw new NotFoundException(
        `Users with IDs ${notFoundIds.join(', ')} not found`,
      );
    }

    return users;
  }

  async findAll(): Promise<User[] | undefined> {
    return await this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const newUser = this.userRepository.create({
        username: createUserDto.username,
        password: hashedPassword,
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('Username already exists');
      }
      throw error;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, id: number) {
    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id: id })
      .execute();
  }
}
