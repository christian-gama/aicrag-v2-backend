import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'

export class ValidateStatus implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    if (input.status !== 'in_progress' && input.status !== 'completed') { return new InvalidParamError('status') }
  }
}
