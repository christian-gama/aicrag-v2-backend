import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidatePeriod implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { period } = input

    if (!period) return

    if (typeof period !== 'string') return new InvalidTypeError('period', 'string', typeof period)

    if (period !== 'today' && period !== 'past_3_days' && period !== 'past_7_days' && period !== 'past_15_days') {
      return new InvalidParamError('period')
    }
  }
}
