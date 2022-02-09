import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateDate implements IValidator {
  validate (input: Record<string, any>): InvalidTypeError | InvalidParamError | undefined {
    const { date } = input

    if (!date) return

    console.log(date)

    if (typeof date !== 'string') {
      return new InvalidTypeError('date', 'string', typeof date)
    }

    if (isNaN(Date.parse(date))) return new InvalidParamError('date')

    const dateArray = date
      .split('-')
      .join(' ')
      .split('T')
      .join(' ')
      .split(':')
      .join(' ')
      .split('.')
      .join(' ')
      .split(' ')

    if (dateArray.length < 7 || dateArray.length > 9) return new InvalidParamError('date')
  }
}
