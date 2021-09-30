import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '../errors'

export class ValidatePassword implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (input.password.length < 6 || input.password.length > 32) { return new InvalidParamError('password') }
  }
}
