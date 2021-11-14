import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { InactiveAccountError, InvalidTypeError } from '../../errors'

export class ValidateActiveAccount implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (input: Record<string, any>): Promise<InvalidTypeError | InactiveAccountError | undefined> {
    const { email } = input

    if (!email) return

    if (typeof email !== 'string') return new InvalidTypeError('email', 'string', typeof email)

    const user = (await this.userRepository.findByEmail(email)) as IUser
    if (!user.settings.accountActivated) return new InactiveAccountError()
  }
}
