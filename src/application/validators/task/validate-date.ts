import { IValidator } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'

export class ValidateDate implements IValidator {
  validate (input: any): InvalidParamError | undefined {
    if (isNaN(Date.parse(input.date))) return new InvalidParamError('date')
  }
}
