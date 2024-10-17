import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepostory: Repository<Category>,

    private dataSource: DataSource,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newCategory = this.categoryRepostory.create({
        name: createCategoryDto.name,
        description: createCategoryDto.description,
      });
      await queryRunner.commitTransaction();
      return await this.categoryRepostory.save(newCategory);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepostory.find();
  }

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepostory.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepostory
      .createQueryBuilder()
      .update(Category)
      .set(updateCategoryDto)
      .where('id = :id', { id: id })
      .execute();
  }

  async remove(id: number) {
    return await this.categoryRepostory
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where('id = :id', { id: 1 })
      .execute();
  }
}
