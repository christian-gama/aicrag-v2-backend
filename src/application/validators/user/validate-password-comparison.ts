import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '../../errors'

export class ValidatePasswordComparison implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | undefined {
    const { password, passwordConfirmation } = input

    if (!password || !passwordConfirmation) return

    if (password !== passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
