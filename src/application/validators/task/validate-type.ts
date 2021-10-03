import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'

export class ValidateType implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (input.type !== 'QA' && input.type !== 'TX') return new InvalidParamError('type')
  }
}
