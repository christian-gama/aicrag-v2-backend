import { IUser } from '@/domain'

import { MailerServiceProtocol, MailerSettingsProtocol } from '@/application/protocols/mailer'

import { MailerService } from './mailer-service'

import { htmlToText } from 'html-to-text'
import path from 'path'
import pug from 'pug'

export class ForgotPasswordEmail extends MailerService implements MailerServiceProtocol {
  async send (user: IUser): Promise<true | Error> {
    const subject = 'Recupere a sua senha clicando no botão abaixo:'

    const html = pug.renderFile(path.resolve(__dirname, 'templates', 'forgot-password.pug'), {
      attachment: `https://aicrag.app.br/login/reset-password/${user.temporary.resetPasswordToken as string}`,
      name: user.personal.name,
      subject
    })

    const settings: MailerSettingsProtocol = {
      html: html,
      subject,
      text: htmlToText(html),
      to: user.personal.email
    }

    return await this.sendEmail(settings)
  }
}
