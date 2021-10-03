import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'

export class ValidateDuration implements ValidatorProtocol {
  validate (input: any): InvalidParamError | undefined {
    switch (input.type) {
      case 'TX':
        if (input.duration > 30 || input.duration <= 0) return new InvalidParamError('duration')
        break
      case 'QA':
        if (input.duration > 2.5 || input.duration <= 0) return new InvalidParamError('duration')
        break
    }
  }
}
