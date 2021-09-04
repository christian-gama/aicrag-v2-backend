import { InvalidParamError } from '@/application/errors'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

export class ComparePasswords implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
