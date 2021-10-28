import { IUser } from '@/domain'
import { IMailerService, IMailerSettings } from '@/domain/mailer'

import { MailerService } from './mailer-service'

import { htmlToText } from 'html-to-text'
import path from 'path'
import pug from 'pug'

export class EmailPin extends MailerService implements IMailerService {
  async send (user: IUser): Promise<true | Error> {
    const subject = 'Utilize o código abaixo para alterar o seu email:'

    const html = pug.renderFile(path.resolve(__dirname, 'templates', 'email-pin.pug'), {
      attachment: user.temporary.tempEmailPin as string,
      name: user.personal.name,
      subject
    })

    const settings: IMailerSettings = {
      html: html,
      subject,
      text: htmlToText(html),
      to: user.temporary.tempEmail as string
    }

    return await this.sendEmail(settings)
  }
}
