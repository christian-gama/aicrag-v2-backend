import { IUser } from '@/domain'
import { ComparerProtocol } from '@/domain/cryptography'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { UserCredentialError } from '../../errors'

export class ValidatePasswordMatch implements ValidatorProtocol {
  constructor (
    private readonly hasher: ComparerProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { email, password } = input

    const user = (await this.userRepository.findUserByEmail(email)) as IUser
    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(password, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
