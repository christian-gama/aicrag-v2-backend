import { IValidator } from '@/domain/validators'
import { InvalidPinError, PinIsExpiredError, InvalidTypeError } from '../../errors'

export class ValidateEmailPin implements IValidator {
  async validate (
    input: Record<string, any>
  ): Promise<PinIsExpiredError | InvalidPinError | InvalidTypeError | undefined> {
    const { emailPin, user } = input

    if (!user) return new InvalidPinError()
    if (typeof emailPin !== 'string') return new InvalidTypeError('tempEmailPin', 'string', typeof emailPin)

    const { tempEmail, tempEmailPin, tempEmailPinExpiration } = user.temporary

    if (!tempEmailPinExpiration) return new InvalidPinError()
    if (emailPin !== tempEmailPin) return new InvalidPinError()
    if (!tempEmail) return new InvalidPinError()
    if (tempEmailPinExpiration.getTime() < Date.now()) {
      return new PinIsExpiredError()
    }
  }
}
