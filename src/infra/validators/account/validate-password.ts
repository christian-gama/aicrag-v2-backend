import { InvalidParamError } from '@/infra/errors'
import { AccountValidator } from '@/application/validators/account/account-validator-protocol'

export class ValidatePassword implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.password.length < 6 || input.password.length > 32) return new InvalidParamError('password')
  }
}
