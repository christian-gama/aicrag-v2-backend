import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateRole implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { role } = input

    if (!role) return

    if (typeof role !== 'string') return new InvalidQueryError('role')

    if (role !== 'administrator' && role !== 'moderator' && role !== 'user' && role !== 'guest') {
      return new InvalidQueryError('role')
    }
  }
}
