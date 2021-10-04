import { ValidatorProtocol, EmailValidatorProtocol } from '@/domain/validators'

import { InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidateEmail implements ValidatorProtocol {
  constructor (private readonly emailValidator: EmailValidatorProtocol) {}

  validate (input: any): InvalidParamError | InvalidTypeError |undefined {
    const { email } = input

    if (typeof email !== 'string') return new InvalidTypeError('email')

    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
