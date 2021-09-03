import { InvalidParamError } from '@/application/errors'
import { Validation } from '../protocols/validation-protocol'

export class ValidatePassword implements Validation {
  validate (input: any): Error | undefined {
    if (input.password.length < 6 || input.password.length > 32) return new InvalidParamError('password')
  }
}
