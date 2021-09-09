import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { EmailValidator } from '@/application/protocols/validators/email-validator/email-validator-protocol'
import { InvalidParamError } from '../../errors'

export class ValidateEmail implements ValidatorProtocol {
  constructor (private readonly emailValidator: EmailValidator) {}

  validate (input: any): Error | undefined {
    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
