import { Injectable } from '@nestjs/common';

import path from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import { MailJobInterface } from '@app/mail/interface/mail-job.interface';
import * as ejs from 'ejs';
import { LoggerService } from '@app/logger';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
  ) {}

  async send(payload: MailJobInterface, template: string) {
    const layoutPath = path.join(__dirname, 'template/partials', 'layout.ejs');
    const templatePath = path.join(
      __dirname,
      'template',
      `${template.toLowerCase()}.ejs`,
    );

    const logoUrl = `https://res.cloudinary.com/dotg85bda/image/upload/v1718083460/header_sb1vlu.jpg`;

    try {
      const templateContent = await ejs.renderFile(templatePath, {
        ...payload.context,
        year: new Date().getFullYear(),
        logo: logoUrl,
      });

      const html = await ejs.renderFile(layoutPath, {
        title: payload.subject,
        content: templateContent,
        partialTemplate: templatePath, // Pass partialTemplate
        data: payload.context, // Pass data
        logo: logoUrl, // Ensure logo is passed here as well
      });

      const mailOptions = {
        from: `NOVASHERE <${process.env.MAIL_FROM}>`,
        to: payload.to,
        subject: payload.subject,
        html,
      };

      await this.mailerService.sendMail(mailOptions);

      this.loggerService.log(`Email sent successfully to ${payload.to}`);
    } catch (error) {
      this.loggerService.error('Error sending email:', error);
    }
  }

  // async findAll(filterOptions, paginationOptions) {
  //   const [data, totalCount] = await this.mailRepository.findAll(
  //     filterOptions,
  //     paginationOptions,
  //   );
  //   return { data, totalCount };
  // }

  // async create(data) {
  //   const createData = {
  //     ...data,
  //     slug: slugify(data?.title),
  //     uuid: uuidv4(),q
  //   };

  //   return await this.mailRepository.create(createData);
  // }

  // async findOne(slug: string) {
  //   return await this.mailRepository.findFirstBy({ slug });
  // }

  // async update(id, data) {
  //   const createData = {
  //     ...data,
  //     slug: slugify(data?.title),
  //   };
  //   return await this.mailRepository.update(id, createData);
  // }

  // async delete(id) {
  //   return await this.mailRepository.delete(id);
  // }

  // private async readHTMLFile(path: string): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     fs.readFile(path, 'utf8', (err, html) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve(html);
  //       }
  //     });
  //   });
  // }
}
