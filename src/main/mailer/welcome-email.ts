import { IUser } from '@/domain'
import { MailerSettingsProtocol, MailerServiceProtocol } from '@/application/protocols/mailer'
import { MailerService } from './mailer-service'

import path from 'path'
import pug from 'pug'
import { htmlToText } from 'html-to-text'

export class WelcomeEmail extends MailerService implements MailerServiceProtocol {
  async send (user: IUser): Promise<true | Error> {
    const subject = 'Boas vindas ao Aicrag! Utilize o código abaixo para ativar a sua conta:'

    const html = pug.renderFile(path.resolve(__dirname, 'templates', 'welcome.pug'), {
      name: user.personal.name,
      subject,
      attachment: user.temporary.activationCode as string
    })

    const settings: MailerSettingsProtocol = {
      to: user.personal.email,
      subject,
      html: html,
      text: htmlToText(html)
    }

    return await this.sendEmail(settings)
  }
}
