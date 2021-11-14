import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidatePasswordComparison implements IValidator {
  validate (input: Record<string, any>): InvalidTypeError | InvalidParamError | undefined {
    const { password, passwordConfirmation } = input

    if (!password || !passwordConfirmation) return

    if (typeof password !== 'string') {
      return new InvalidTypeError('password', 'string', typeof password)
    }

    if (typeof passwordConfirmation !== 'string') {
      return new InvalidTypeError('passwordConfirmation', 'string', typeof passwordConfirmation)
    }

    if (password !== passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
