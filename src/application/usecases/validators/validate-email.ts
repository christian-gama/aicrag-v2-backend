import { EmailValidatorProtocol, ValidatorProtocol } from '@/application/protocols/validators'
import { InvalidParamError } from '@/application/usecases/errors'

export class ValidateEmail implements ValidatorProtocol {
  constructor (private readonly emailValidator: EmailValidatorProtocol) {}

  validate (input: any): Error | undefined {
    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
