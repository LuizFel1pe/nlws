import { MailAdapter, SendMailData } from '../mailAdapter';
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '4b372e08df3d64',
    pass: '0e168eac9996f6',
  },
});

export class NodemailerMailAdapter implements MailAdapter {
  async sendMail({ subject, body }: SendMailData) {
    transport.sendMail({
      from: 'Equipe Feedget <hello@feedget.com',
      to: 'Luiz Felipe <luizfelipe@gmail.com',
      subject,
      html: body,
    });
  }
}
