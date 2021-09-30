/**
 * @description Interface used for create a new email.
 */

export interface MailerSettingsProtocol {
  readonly html: string
  readonly subject: string
  readonly text: string
  readonly to: string
}
