import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidatePage implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { page } = input

    if (!page) return

    if (typeof page !== 'string') return new InvalidTypeError('page', 'string', typeof page)

    if (!page.match(/^[0-9]*$/)) return new InvalidParamError('page')

    if (!Number.isSafeInteger(+page)) return new InvalidParamError('page')

    if (+page <= 0) return new InvalidParamError('page')
  }
}
