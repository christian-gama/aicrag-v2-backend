import { IUser } from '@/domain'
import { IMailerService, IMailerSettings } from '@/domain/mailer'

import { MailerService } from './mailer-service'

import { htmlToText } from 'html-to-text'
import path from 'path'
import pug from 'pug'

export class WelcomeEmail extends MailerService implements IMailerService {
  async send (user: IUser): Promise<true | Error> {
    const subject = 'Boas vindas ao Aicrag! Utilize o código abaixo para ativar a sua conta:'

    const html = pug.renderFile(path.resolve(__dirname, 'templates', 'welcome.pug'), {
      attachment: user.temporary.activationPin as string,
      name: user.personal.name,
      subject
    })

    const settings: IMailerSettings = {
      html: html,
      subject,
      text: htmlToText(html),
      to: user.personal.email
    }

    return await this.sendEmail(settings)
  }
}
