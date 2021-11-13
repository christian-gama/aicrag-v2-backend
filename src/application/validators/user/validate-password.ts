import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidatePassword implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | InvalidTypeError | undefined {
    const { password } = input

    if (typeof password !== 'string') return new InvalidTypeError('password', 'string', typeof password)

    if (password.length < 6 || password.length > 32) {
      return new InvalidParamError('password')
    }
  }
}
