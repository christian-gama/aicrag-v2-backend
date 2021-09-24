import { ValidatorProtocol } from '@/application/protocols/validators'

import { InvalidParamError } from '../errors'

export class ValidatePasswordComparasion implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
