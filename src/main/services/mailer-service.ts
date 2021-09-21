import { MailerServiceProtocol } from '@/application/protocols/services/mailer/mailer-service-protocol'
import { MailerSettingsProtocol } from '@/application/protocols/services/mailer/mailer-settings-protocol'
import { MailerServiceError } from '@/application/usecases/errors/mailer-service-error'
import { env } from '../config/env'

import * as nodemailer from 'nodemailer'
import sendgrid from 'nodemailer-sendgrid'

export class MailerService implements MailerServiceProtocol {
  async send (options: MailerSettingsProtocol): Promise<true | Error> {
    try {
      await this.transporter().sendMail({
        from: env.MAILER.SETTINGS.FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      })
    } catch (error) {
      return new MailerServiceError()
    }

    return true
  }

  private transporter (): nodemailer.Transporter {
    if (env.SERVER.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: env.MAILER.MAILTRAP.HOST,
        port: +env.MAILER.MAILTRAP.PORT,
        auth: {
          user: env.MAILER.MAILTRAP.HOST,
          pass: env.MAILER.MAILTRAP.PASSWORD
        }
      })
    }

    return nodemailer.createTransport(sendgrid({ apiKey: env.MAILER.SENDGRID.APIKEY as string }))
  }
}
