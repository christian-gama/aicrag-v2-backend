import { InvalidParamError } from '@/application/errors'
import { EmailValidator } from '@/application/validators/protocols/email-validator-protocol'
import { Validation } from '../protocols/validation-protocol'

export class ValidateEmail implements Validation {
  constructor (private readonly emailValidator: EmailValidator) {}

  validate (input: any): Error | undefined {
    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
