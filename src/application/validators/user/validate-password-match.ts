import { IUser } from '@/domain'
import { ComparerProtocol } from '@/domain/cryptography'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { UserCredentialError } from '../../errors'

export class ValidatePasswordMatch implements ValidatorProtocol {
  constructor (
    private readonly hasher: ComparerProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { email, password } = input

    const user = (await this.userDbRepository.findUserByEmail(email)) as IUser
    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(password, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
