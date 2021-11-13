import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateMonth implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    if (typeof input.month !== 'string') return new InvalidQueryError('month')

    if (!input.month.match(/^([0-9]{1})$|^([0-9]{2})$/)) return new InvalidQueryError('month')

    if (+input.month < 0 || +input.month > 11) return new InvalidQueryError('month')
  }
}
