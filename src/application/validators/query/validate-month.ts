import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateMonth implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { month } = input

    if (typeof month !== 'string') return new InvalidQueryError('month')

    if (+month < 0 || +month > 11) return new InvalidQueryError('month')
  }
}
