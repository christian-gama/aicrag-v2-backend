/**
 * @description Interface used for create a new email.
 */

export interface MailerSettingsProtocol {
  readonly to: string
  readonly subject: string
  readonly text: string
  readonly html: string
}
