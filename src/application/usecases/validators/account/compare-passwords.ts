import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { InvalidParamError } from '../../errors'

export class ComparePasswords implements AccountValidatorProtocol {
  validate (input: any): Error | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
