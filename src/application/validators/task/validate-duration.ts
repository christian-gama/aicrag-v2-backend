import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateDuration implements IValidator {
  validate (input: Record<string, any>): InvalidParamError | InvalidTypeError | undefined {
    const { duration, type } = input

    if (!duration) return

    if (typeof duration !== 'number') return new InvalidTypeError('duration', 'number', typeof duration)

    switch (type) {
      case 'TX':
        if (duration > 30 || duration <= 0) return new InvalidParamError('duration')
        break
      case 'QA':
        if (duration > 2.5 || duration <= 0) return new InvalidParamError('duration')
        break
    }
  }
}
