import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidatePage implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    if (!input.page) return

    if (typeof input.page !== 'string') return new InvalidQueryError('page')

    if (!input.page.match(/^[0-9]*$/)) return new InvalidQueryError('page')

    if (!Number.isSafeInteger(+input.page)) return new InvalidQueryError('page')

    if (+input.page <= 0) return new InvalidQueryError('page')
  }
}
