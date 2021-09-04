import { InvalidParamError } from '@/infra/errors'
import { AccountValidator } from '@/application/validators/account/account-validator-protocol'

export class ComparePasswords implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
