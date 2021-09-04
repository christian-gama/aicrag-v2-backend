import { InvalidParamError } from '@/application/errors'
import { EmailValidator } from '@/application/validators/protocols/email-validator-protocol'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

export class ValidateEmail implements AccountValidator {
  constructor (private readonly emailValidator: EmailValidator) {}

  validate (input: any): Error | undefined {
    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
