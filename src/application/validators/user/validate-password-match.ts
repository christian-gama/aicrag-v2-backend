import { IUser } from '@/domain'
import { IComparer } from '@/domain/cryptography'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { InvalidTypeError, UserCredentialError } from '../../errors'

export class ValidatePasswordMatch implements IValidator {
  constructor (private readonly hasher: IComparer, private readonly userRepository: IUserRepository) {}

  async validate (input: Record<string, any>): Promise<InvalidTypeError | UserCredentialError | undefined> {
    const { email, password } = input

    if (!email || !password) return

    if (typeof email !== 'string') {
      return new InvalidTypeError('email', 'string', typeof email)
    }

    if (typeof password !== 'string') {
      return new InvalidTypeError('password', 'string', typeof password)
    }

    const user = (await this.userRepository.findByEmail(email)) as IUser
    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(password, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
