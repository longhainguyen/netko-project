import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { WeatherService } from './weather/weather.service';
import { WeatherController } from './weather/weather.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { BooksModule } from './books/books.module';
import { CategoryModule } from './category/category.module';
import { MailModule } from './mail/mail.module';
import { VerificationModule } from './verification/verification.module';
import { AccountGuard } from './auth/account.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AuthModule,
    BooksModule,
    CategoryModule,
    MailModule,
    VerificationModule,
  ],
  controllers: [AppController, WeatherController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccountGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    WeatherService,
  ],
})
export class AppModule {}
