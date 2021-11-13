import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateRole implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { role } = input

    if (!role) return

    if (typeof role !== 'string') return new InvalidParamError('role')

    const roles = ['administrator', 'moderator', 'user', 'guest']
    if (!roles.includes(role)) {
      return new InvalidParamError('role')
    }
  }
}
