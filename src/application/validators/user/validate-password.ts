import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidatePassword implements ValidatorProtocol {
  validate (input: any): InvalidParamError | InvalidTypeError | undefined {
    const { password } = input

    if (typeof password !== 'string') return new InvalidTypeError('password')

    if (input.password.length < 6 || input.password.length > 32) { return new InvalidParamError('password') }
  }
}
