import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateLimit implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { limit } = input

    if (!limit) return

    if (typeof limit !== 'string') return new InvalidQueryError('limit')

    if (!limit.match(/^[0-9]*$/)) return new InvalidQueryError('limit')

    if (!Number.isSafeInteger(+limit)) return new InvalidQueryError('limit')

    if (+limit > 1000) return new InvalidQueryError('limit')

    if (+limit <= 0) return new InvalidQueryError('limit')
  }
}
