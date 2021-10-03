import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '../../errors'

export class ValidatePasswordComparasion implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
