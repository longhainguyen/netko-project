import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum/role.enum';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
@ApiBearerAuth('JWT-auth')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'create a category' })
  @Roles(UserRole.Admin)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @Public()
  async findAll() {
    try {
      return await this.categoryService.findAll();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Retreieve a category' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.categoryService.findAll();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      return await this.categoryService.update(+id, updateCategoryDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Failed to update category. Please check the input data or ID.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.categoryService.remove(+id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to delete category. Please check the input ID.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
