import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateYear implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { year } = input

    if (typeof year !== 'string') return new InvalidTypeError('year', 'string', typeof year)

    // Match format xxxx being x a number
    if (!year.match(/^[0-9]{4}$/)) return new InvalidParamError('year')
  }
}
