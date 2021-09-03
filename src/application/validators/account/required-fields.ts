import { MissingParamError } from '@/application/errors'
import { Validation } from '../protocols/validation-protocol'

export class RequiredFields implements Validation {
  constructor (private readonly field: string) {}

  validate (input: any): Error | undefined {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
