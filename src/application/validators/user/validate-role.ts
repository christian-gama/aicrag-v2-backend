import { IUserRole } from '@/domain'
import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError, PermissionError } from '@/application/errors'

export class ValidateRole implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { role, user } = input

    if (!role) return

    if (typeof role !== 'string') return new InvalidTypeError('role', 'string', typeof role)

    // ID represents the user ID, which means that the user is trying to update another user's/his role
    if (user?.settings.role === IUserRole.administrator) {
      return new PermissionError()
    }

    const roles = ['administrator', 'moderator', 'user', 'guest']
    if (!roles.includes(role)) {
      return new InvalidParamError('role')
    }
  }
}
