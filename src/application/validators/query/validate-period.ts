import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidatePeriod implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    if (!input.period) return

    if (typeof input.period !== 'string') return new InvalidQueryError('period')

    if (
      input.period !== 'today' &&
      input.period !== 'past_3_days' &&
      input.period !== 'past_7_days' &&
      input.period !== 'past_15_days'
    ) {
      return new InvalidQueryError('period')
    }
  }
}
