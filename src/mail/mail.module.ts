import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailRepository } from '@app/mail/mail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from '@app/mail/entities/mail.entity';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';

@Global()
@Module({
  controllers: [MailController],
  providers: [MailService, MailRepository],
  imports: [
    TypeOrmModule.forFeature([EmailTemplate]),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT),
          secure: false,
          ignoreTLS: false,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: `NOGICJQS <${process.env.MAIL_FROM}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),
  ],
  exports: [MailService, MailRepository],
})
export class MailModule {}
