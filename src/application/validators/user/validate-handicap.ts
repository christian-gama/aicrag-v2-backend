import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateHandicap implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { handicap } = input

    if (!handicap) return

    if (typeof handicap !== 'number') return new InvalidTypeError('handicap', 'number', typeof handicap)

    const handicapRange = [0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1]
    if (!handicapRange.includes(handicap)) {
      return new InvalidParamError('handicap')
    }
  }
}
