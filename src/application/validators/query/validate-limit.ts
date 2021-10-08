import { ValidatorProtocol } from '@/domain/validators'

import { InvalidQueryError } from '@/application/errors'

export class ValidateLimit implements ValidatorProtocol {
  async validate (input: any): Promise<InvalidQueryError | undefined> {
    if (!input.limit) return

    if (typeof input.limit !== 'string') return new InvalidQueryError('limit')

    if (!input.limit.match(/^[0-9]*$/)) return new InvalidQueryError('limit')

    if (!Number.isSafeInteger(+input.limit)) return new InvalidQueryError('limit')

    if (+input.limit > 1000) return new InvalidQueryError('limit')

    if (+input.limit <= 0) return new InvalidQueryError('limit')
  }
}
