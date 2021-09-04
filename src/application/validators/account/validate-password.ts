import { InvalidParamError } from '@/application/errors'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

export class ValidatePassword implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.password.length < 6 || input.password.length > 32) return new InvalidParamError('password')
  }
}
