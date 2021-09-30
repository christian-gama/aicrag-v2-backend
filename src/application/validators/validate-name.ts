import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '../errors'

export class ValidateName implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (input.name.match(/[^a-zA-Z .']/g)) return new InvalidParamError('name')
  }
}
