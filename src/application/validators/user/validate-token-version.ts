import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateTokenVersion implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { tokenVersion } = input

    if (!tokenVersion) return

    if (typeof tokenVersion !== 'number') return new InvalidTypeError('tokenVersion', 'number', typeof tokenVersion)

    if (tokenVersion < 0 || tokenVersion > Number.MAX_SAFE_INTEGER) return new InvalidParamError('tokenVersion')
  }
}
