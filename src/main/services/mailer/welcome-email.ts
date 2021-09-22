import { IUser } from '@/domain/user'
import { MailerSettingsProtocol } from '@/application/protocols/services/mailer/mailer-settings-protocol'
import { MailerService } from './mailer-service'

import path from 'path'
import pug from 'pug'
import { htmlToText } from 'html-to-text'
import { MailerServiceProtocol } from '@/application/protocols/services/mailer/mailer-service-protocol'

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
