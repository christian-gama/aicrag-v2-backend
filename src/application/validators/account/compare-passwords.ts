import { InvalidParamError } from '@/application/errors'
import { Validation } from '../protocols/validation-protocol'

export class ComparePasswords implements Validation {
  validate (input: any): Error | undefined {
    if (input.password !== input.passwordConfirmation) { return new InvalidParamError('passwordConfirmation') }
  }
}
