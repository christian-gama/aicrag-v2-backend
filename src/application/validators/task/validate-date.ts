import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateDate implements IValidator {
  validate (input: Record<string, any>): InvalidTypeError | InvalidParamError | undefined {
    const { date } = input

    if (!date) return

    if (typeof date !== 'string' && typeof date !== 'object') {
      return new InvalidTypeError('date', 'string', typeof date)
    }

    if (isNaN(Date.parse(date))) return new InvalidParamError('date')
  }
}
