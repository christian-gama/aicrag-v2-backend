/**
 * @description Interface used for create a new email.
 */

export interface MailerSettingsProtocol {
  readonly host: string
  readonly port: number
  readonly username: string
  readonly password: string
  readonly from: string
  readonly to: string
  readonly subject: string
  readonly text: string
  readonly html: string
}
