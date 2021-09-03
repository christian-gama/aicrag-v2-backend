import { InvalidParamError } from '@/application/errors'
import { Validation } from '../protocols/validation-protocol'

export class ValidateName implements Validation {
  validate (input: any): Error | undefined {
    if (input.name.match(/[^a-zA-Z ]/g)) return new InvalidParamError('name')
  }
}
