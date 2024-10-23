import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UnprocessableEntityException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/constant/enum/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './entities/user.entity';
import { Public } from 'src/decorators/public.decorator';
import { UpdateUserDto, UpdateUserFromCreateDto } from './dto/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import e from 'express';
import { AccountGuard } from 'src/auth/account.guard';
import { NoAccountGuard } from 'src/decorators/no-account-guard.decorator';
import { validate } from 'class-validator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(
    private readonly userService: UserService,

    private readonly mailService: MailService,
  ) {}

  @Get()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Get all users' })
  @UseInterceptors(ClassSerializerInterceptor)
  getAllUsers() {
    return this.userService.findAll();
  }

  @Post('/sign-up')
  @ApiOperation({ summary: 'Create a new user' })
  @Public()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.createUser(createUserDto);
      return plainToInstance(User, user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'Failed to create user profile. Please try again.',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'Người dùng đã được cập nhật thành công',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async update(@Request() req, @Body() updateUserDto: UpdateUserFromCreateDto) {
    try {
      const userId = +req.user.id;

      const updatedUser = await this.userService.updateUser(
        updateUserDto,
        userId,
      );

      return {
        success: true,
        message: 'User profile updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      // console.log(error);

      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'Failed to update user profile. Please try again.',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @NoAccountGuard()
  @ApiOperation({ summary: 'Create a verification-otp' })
  @Post('verification-otp')
  async generateEmailVerification(@Request() req) {
    try {
      await this.userService.sendMailConfirm(req.user);
      return {
        status: 'success',
        message: 'Sending email in a momnet',
      };
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error.getResponse();
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'An unexpected error occurred',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @NoAccountGuard()
  @Post('verify/:otp')
  @ApiOperation({ summary: 'verify a otp' })
  async verifyEmail(@Param('otp') otp: string, @Request() req) {
    try {
      const result = await this.userService.verifyEmail(req.user.id, otp);

      return { status: result ? 'sucess' : 'failure', message: null };
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw error.getResponse();
      }
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: 'An unexpected error occurred',
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
