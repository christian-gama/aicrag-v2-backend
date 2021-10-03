import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'

export class ValidateDate implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (!(input.date instanceof Date)) return new InvalidParamError('date')
  }
}
