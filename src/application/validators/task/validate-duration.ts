import { IValidator } from '@/domain/validators'

import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateDuration implements IValidator {
  validate (input: any): InvalidParamError | InvalidTypeError | undefined {
    if (typeof input.duration !== 'number') return new InvalidTypeError('duration')

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
