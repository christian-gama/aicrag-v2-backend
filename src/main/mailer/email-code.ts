import { IUser } from '@/domain'
import { MailerServiceProtocol, MailerSettingsProtocol } from '@/domain/mailer'

import { MailerService } from './mailer-service'

import { htmlToText } from 'html-to-text'
import path from 'path'
import pug from 'pug'

export class EmailCode extends MailerService implements MailerServiceProtocol {
  async send (user: IUser): Promise<true | Error> {
    const subject = 'Utilize o código abaixo para alterar o seu email:'

    const html = pug.renderFile(path.resolve(__dirname, 'templates', 'email-code.pug'), {
      attachment: user.temporary.tempEmailCode as string,
      name: user.personal.name,
      subject
    })

    const settings: MailerSettingsProtocol = {
      html: html,
      subject,
      text: htmlToText(html),
      to: user.temporary.tempEmail as string
    }

    return await this.sendEmail(settings)
  }
}
