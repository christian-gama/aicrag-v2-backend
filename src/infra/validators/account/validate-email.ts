import { InvalidParamError } from '@/infra/errors'
import { EmailValidator } from '@/application/validators/email-validator/email-validator-protocol'
import { AccountValidator } from '@/application/validators/account/account-validator-protocol'

export class ValidateEmail implements AccountValidator {
  constructor (private readonly emailValidator: EmailValidator) {}

  validate (input: any): Error | undefined {
    if (!this.emailValidator.isEmail(input.email)) return new InvalidParamError('email')
  }
}
