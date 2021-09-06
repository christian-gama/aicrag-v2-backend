import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { InvalidParamError } from '../../errors'

export class ValidatePassword implements AccountValidatorProtocol {
  validate (input: any): Error | undefined {
    if (input.password.length < 6 || input.password.length > 32) return new InvalidParamError('password')
  }
}
