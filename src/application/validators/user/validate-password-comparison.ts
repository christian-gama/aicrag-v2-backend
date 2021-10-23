import { IValidator } from '@/domain/validators'

import { InvalidParamError } from '../../errors'

export class ValidatePasswordComparison implements IValidator {
  validate (input: any): InvalidParamError | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
