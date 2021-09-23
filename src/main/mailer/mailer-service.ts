import { MailerSettingsProtocol } from '@/application/protocols/mailer'
import { MailerServiceError } from '@/application/usecases/errors'
import { environment } from '../config/environment'

import * as nodemailer from 'nodemailer'
import sendgrid from 'nodemailer-sendgrid'

export abstract class MailerService {
  protected async sendEmail (settings: MailerSettingsProtocol): Promise<true | MailerServiceError> {
    try {
      await this.transporter.sendMail({
        from: environment.MAILER.SETTINGS.FROM,
        to: settings.to,
        subject: settings.subject,
        text: settings.text,
        html: settings.html
      })
    } catch (error) {
      return new MailerServiceError()
    }

    return true
  }

  private get transporter (): nodemailer.Transporter {
    if (environment.SERVER.NODE_ENV === 'development' || environment.SERVER.NODE_ENV === 'test') {
      return nodemailer.createTransport({
        host: environment.MAILER.MAILTRAP.HOST,
        port: +environment.MAILER.MAILTRAP.PORT,
        auth: {
          user: environment.MAILER.MAILTRAP.USER,
          pass: environment.MAILER.MAILTRAP.PASSWORD
        }
      })
    }

    return nodemailer.createTransport(sendgrid({ apiKey: environment.MAILER.SENDGRID.APIKEY as string }))
  }
}
