import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateRole implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    if (!input.role) return

    if (typeof input.role !== 'string') return new InvalidQueryError('role')

    if (
      input.role !== 'administrator' &&
      input.role !== 'moderator' &&
      input.role !== 'user' &&
      input.role !== 'guest'
    ) {
      return new InvalidQueryError('role')
    }
  }
}
