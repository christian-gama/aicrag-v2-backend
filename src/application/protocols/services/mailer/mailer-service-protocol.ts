import { MailerSettingsProtocol } from './mailer-settings-protocol'

export interface MailerServiceProtocol {
  /**
   * @description Receive the email settings and send it with through a transport.
   * @param settings Settings that compose a email.
   * @returns Return the mailer settings.
   */
  send: (settings: MailerSettingsProtocol) => Promise<true | Error>

  /**
   * @description Create the mailer transport.
   * @returns Return any mailer transport.
   */
  transporter: () => unknown
}
