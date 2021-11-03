import { IValidator } from '@/domain/validators'
import { InvalidPinError, PinIsExpiredError, InvalidTypeError } from '../../errors'

export class ValidateEmailPin implements IValidator {
  async validate (input: any): Promise<PinIsExpiredError | InvalidPinError | InvalidTypeError | undefined> {
    const { emailPin, user } = input

    if (!user) return new InvalidPinError()
    if (typeof emailPin !== 'string') return new InvalidTypeError('tempEmailPin')

    if (user.temporary.tempEmailPinExpiration == null) return new InvalidPinError()
    if (emailPin !== user.temporary.tempEmailPin) return new InvalidPinError()
    if (!user.temporary.tempEmail) return new InvalidPinError()
    if (user.temporary.tempEmailPinExpiration.getTime() < Date.now()) {
      return new PinIsExpiredError()
    }
  }
}
