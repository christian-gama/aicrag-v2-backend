import { IUser } from '@/domain/user'
import { MailerSettingsProtocol } from '@/application/protocols/services/mailer/mailer-settings-protocol'
import { MailerService } from './mailer-service'

import path from 'path'
import pug from 'pug'
import { htmlToText } from 'html-to-text'
import { MailerServiceProtocol } from '@/application/protocols/services/mailer/mailer-service-protocol'

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
