import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { InvalidParamError } from '../../errors'

export class ComparePasswords implements ValidatorProtocol {
  validate (input: any): Error | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
