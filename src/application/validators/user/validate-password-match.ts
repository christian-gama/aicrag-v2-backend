import { IUser } from '@/domain'
import { IComparer } from '@/domain/cryptography'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { UserCredentialError } from '../../errors'

export class ValidatePasswordMatch implements IValidator {
  constructor (private readonly hasher: IComparer, private readonly userRepository: IUserRepository) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { email, password } = input

    const user = (await this.userRepository.findByEmail(email)) as IUser
    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(password, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
