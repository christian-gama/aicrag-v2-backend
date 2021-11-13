import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateRole implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { role } = input

    if (!role) return

    if (typeof role !== 'string') return new InvalidTypeError('role', 'string', typeof role)

    const roles = ['administrator', 'moderator', 'user', 'guest']
    if (!roles.includes(role)) {
      return new InvalidParamError('role')
    }
  }
}
