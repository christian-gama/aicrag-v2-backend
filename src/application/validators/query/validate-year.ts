import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateYear implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { year } = input

    if (typeof year !== 'string') return new InvalidQueryError('year')

    // Match format xxxx being x a number
    if (!year.match(/^[0-9]{4}$/)) return new InvalidQueryError('year')
  }
}
