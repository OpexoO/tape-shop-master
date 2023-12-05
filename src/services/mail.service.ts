import { Transporter, createTransport } from 'nodemailer';
import LinkService from './link.service';

export default class MailService {
  private static transport: Transporter;

  private static getTransport(): Transporter {
    if (!this.transport) {
      this.transport = createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      } as any);
    }

    return this.transport;
  }

  public static register(email: string, hash: string): Promise<unknown> {
    return this.getTransport().sendMail({
      to: email,
      from: 'communication@quiptaping.com',
      subject: 'Verifying account',
      html: `
        <table style="font-size: 16px; width: 100%;">
          <tr>
            <td>
              Your account has been created. To proceed using it, please verify your account using this
              <a href="${LinkService.mailVerifyLink(hash)}">link</a>.
            </td>
          </tr>
        </table>
      `,
    });
  }

  public static reset(email: string, hash: string): Promise<unknown> {
    return this.getTransport().sendMail({
      to: email,
      from: 'communication@quiptaping.com',
      subject: 'Reset password',
      html: `
        <table style="font-size: 16px; width: 100%;">
          <tr>
            <td>
              Click on link below to create new password.
            </td>
          </tr>
          <tr>
            <td>
              <a href="${LinkService.mailResetLink(hash)}">Reset password</a>.
            </td>
          </tr>
        </table>
    `,
    });
  }
}
