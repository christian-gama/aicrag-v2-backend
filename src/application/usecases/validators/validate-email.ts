import { ValidatorProtocol, EmailValidatorProtocol } from '@/application/protocols/validators'
import { InvalidParamError } from '../errors'

export class ValidateEmail implements ValidatorProtocol {
  constructor (private readonly emailValidator: EmailValidatorProtocol) {}

  validate (input: any): InvalidParamError | undefined {
    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
