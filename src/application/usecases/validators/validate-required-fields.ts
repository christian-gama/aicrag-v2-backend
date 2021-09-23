import { ValidatorProtocol } from '@/application/protocols/validators'
import { MissingParamError } from '../errors'

export class ValidateRequiredFields implements ValidatorProtocol {
  constructor (private readonly field: string) {}

  validate (input: any): Error | undefined {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
