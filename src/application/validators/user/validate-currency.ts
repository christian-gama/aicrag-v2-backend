import { IValidator } from '@/domain/validators'

import { InvalidParamError } from '../../errors'

export class ValidateCurrency implements IValidator {
  validate (input: any): InvalidParamError | undefined {
    if (input.currency !== 'BRL' && input.currency !== 'USD') {
      return new InvalidParamError('currency')
    }
  }
}
