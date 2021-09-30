import { MailerSettingsProtocol } from '@/domain/mailer'

import { MailerServiceError } from '@/application/errors'

import { environment } from '../config/environment'

import * as nodemailer from 'nodemailer'
import { Transporter } from 'nodemailer'
import sendgrid from 'nodemailer-sendgrid'

export abstract class MailerService {
  protected async sendEmail (settings: MailerSettingsProtocol): Promise<true | MailerServiceError> {
    try {
      await this.transporter.sendMail({
        from: environment.MAILER.SETTINGS.FROM,
        html: settings.html,
        subject: settings.subject,
        text: settings.text,
        to: settings.to
      })
    } catch (error) {
      return new MailerServiceError()
    }

    return true
  }

  private get transporter (): Transporter {
    switch (environment.SERVER.NODE_ENV) {
      case 'development':
        return this.mailtrap()
      case 'production':
        return this.sendgrid()
      case 'test':
        return this.mailtrap()
    }
  }

  private mailtrap (): nodemailer.Transporter {
    return nodemailer.createTransport({
      auth: {
        pass: environment.MAILER.MAILTRAP.PASSWORD,
        user: environment.MAILER.MAILTRAP.USER
      },
      host: environment.MAILER.MAILTRAP.HOST,
      port: +environment.MAILER.MAILTRAP.PORT
    })
  }

  private sendgrid (): Transporter {
    return nodemailer.createTransport(
      sendgrid({ apiKey: environment.MAILER.SENDGRID.APIKEY as string })
    )
  }
}
