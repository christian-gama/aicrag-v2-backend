import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { ConflictParamError, InvalidTypeError } from '../../errors'

export class ValidateEmailAlreadyExists implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (input: Record<string, any>): Promise<ConflictParamError | undefined> {
    const { email } = input

    if (!email) return

    if (typeof email !== 'string') {
      return new InvalidTypeError('email', 'string', typeof email)
    }

    const user = await this.userRepository.findByEmail(email)
    if (user) return new ConflictParamError('email')
  }
}
