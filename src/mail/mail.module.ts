import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        // transport: config.getOrThrow('MAIL_TRANSPORT'),
        // or
        transport: {
          host: config.getOrThrow('MAIL_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: config.getOrThrow('MAIL_USER'),
            pass: config.getOrThrow('MAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },

        defaults: {
          from: `"No Reply" <${config.getOrThrow('MAIL_FROM')}>`,
        },
        preview: false,
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
