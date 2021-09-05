import { AccountValidator } from '@/application/protocols/validators/account/account-validator-protocol'
import { InvalidParamError } from '../../errors'

export class ComparePasswords implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
