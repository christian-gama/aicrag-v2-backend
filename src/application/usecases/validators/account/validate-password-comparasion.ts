import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { InvalidParamError } from '@/application/usecases/errors'

export class ValidatePasswordComparasion implements ValidatorProtocol {
  validate (input: any): Error | undefined {
    if (input.password !== input.passwordConfirmation) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
