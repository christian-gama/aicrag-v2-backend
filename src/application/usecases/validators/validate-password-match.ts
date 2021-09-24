import { IUser } from '@/domain'

import { ComparerProtocol } from '@/application/protocols/cryptography'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'

import { UserCredentialError } from '../errors'

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
