import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '../errors'

export class ValidateCurrency implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (input.currency !== 'BRL' || input.currency !== 'USD') { return new InvalidParamError('currency') }
  }
}
