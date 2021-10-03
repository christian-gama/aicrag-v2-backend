import { ValidatorProtocol } from '@/domain/validators'

import { MissingParamError } from '../../errors'

export class ValidateRequiredFields implements ValidatorProtocol {
  constructor (private readonly field: string) {}

  validate (input: any): MissingParamError | undefined {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
