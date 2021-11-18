import { IUserRole } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { ForbiddenError } from 'apollo-server-errors'

export class ValidateDeletePermission implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (input: Record<string, any>): Promise<ForbiddenError | undefined> {
    const { user, id } = input

    if (!id || !user) return

    const userToDelete = await this.userRepository.findById(id)

    if (userToDelete?.personal.id === user.personal.id) {
      return new ForbiddenError('You cannot delete yourself')
    }

    if (userToDelete?.settings.role === IUserRole.administrator) {
      return new ForbiddenError('You cannot delete an administrator')
    }
  }
}
