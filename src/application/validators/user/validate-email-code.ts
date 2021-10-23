import { IValidator } from '@/domain/validators'

import { InvalidCodeError, CodeIsExpiredError, InvalidTypeError } from '../../errors'

export class ValidateEmailCode implements IValidator {
  async validate (input: any): Promise<CodeIsExpiredError | InvalidCodeError | InvalidTypeError | undefined> {
    const { emailCode, user } = input

    if (!user) return new InvalidCodeError()
    if (typeof emailCode !== 'string') return new InvalidTypeError('tempEmailCode')

    if (user.temporary.tempEmailCodeExpiration == null) return new InvalidCodeError()
    if (emailCode !== user.temporary.tempEmailCode) return new InvalidCodeError()
    if (!user.temporary.tempEmail) return new InvalidCodeError()
    if (user.temporary.tempEmailCodeExpiration.getTime() < Date.now()) {
      return new CodeIsExpiredError()
    }
  }
}
