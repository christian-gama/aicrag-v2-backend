import { IUser } from '@/domain'
import { MailerSettingsProtocol, MailerServiceProtocol } from '@/application/protocols/mailer'
import { MailerService } from './mailer-service'

import path from 'path'
import pug from 'pug'
import { htmlToText } from 'html-to-text'

export class ForgotPasswordEmail extends MailerService implements MailerServiceProtocol {
  async send (user: IUser): Promise<true | Error> {
    const subject = 'Recupere a sua senha clicando no botão abaixo:'

    const html = pug.renderFile(path.resolve(__dirname, 'templates', 'forgot-password.pug'), {
      name: user.personal.name,
      subject,
      attachment: `https://aicrag.app.br/account/reset-password/${user.temporary.resetPasswordToken as string}`
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
