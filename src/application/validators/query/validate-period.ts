import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidatePeriod implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { period } = input

    if (!period) return

    if (typeof period !== 'string') return new InvalidQueryError('period')

    if (period !== 'today' && period !== 'past_3_days' && period !== 'past_7_days' && period !== 'past_15_days') {
      return new InvalidQueryError('period')
    }
  }
}
