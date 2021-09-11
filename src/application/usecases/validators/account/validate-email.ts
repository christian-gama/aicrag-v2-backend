import { EmailValidatorProtocol } from '@/application/protocols/validators/email-validator/email-validator-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { InvalidParamError } from '@/application/usecases/errors'

export class ValidateEmail implements ValidatorProtocol {
  constructor (private readonly emailValidator: EmailValidatorProtocol) {}

  validate (input: any): Error | undefined {
    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
