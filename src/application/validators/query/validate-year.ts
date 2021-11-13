import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateYear implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    if (typeof input.year !== 'string') return new InvalidQueryError('year')

    if (!input.year.match(/^[0-9]{4}$/)) return new InvalidQueryError('year')
  }
}
