import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateRole implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { role } = input

    if (!role) return

    if (typeof role !== 'string') return new InvalidQueryError('role')

    const roles = ['administrator', 'moderator', 'user', 'guest']
    if (!roles.includes(role)) {
      return new InvalidQueryError('role')
    }
  }
}
