import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateLimit implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { limit } = input

    if (!limit) return

    if (typeof limit !== 'string') return new InvalidParamError('limit')

    if (!limit.match(/^[0-9]*$/)) return new InvalidParamError('limit')

    if (!Number.isSafeInteger(+limit)) return new InvalidParamError('limit')

    if (+limit > 1000) return new InvalidParamError('limit')

    if (+limit <= 0) return new InvalidParamError('limit')
  }
}
