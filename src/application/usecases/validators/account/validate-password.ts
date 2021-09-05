import { AccountValidator } from '@/application/protocols/validators/account/account-validator-protocol'
import { InvalidParamError } from '../../errors'

export class ValidatePassword implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.password.length < 6 || input.password.length > 32) return new InvalidParamError('password')
  }
}
