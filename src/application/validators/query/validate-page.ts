import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidatePage implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { page } = input

    if (!page) return

    if (typeof page !== 'string') return new InvalidQueryError('page')

    if (!page.match(/^[0-9]*$/)) return new InvalidQueryError('page')

    if (!Number.isSafeInteger(+page)) return new InvalidQueryError('page')

    if (+page <= 0) return new InvalidQueryError('page')
  }
}
