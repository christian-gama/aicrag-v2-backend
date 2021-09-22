import { MailerServiceError } from '@/application/usecases/errors'
import { IUser } from '@/domain/user'

export interface MailerServiceProtocol {
  /**
   * @description Send a welcome email to the user, containing a activation code.
   * @param user The user that will be used to send the email.
   * @returns Return true if email succeds or an Error if fails.
   */
  send: (user: IUser) => Promise<true | MailerServiceError>
}
