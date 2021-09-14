import { User } from '@/domain/user'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ComparerProtocol } from '@/application/protocols/cryptography'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { UserCredentialError } from '../../errors'

export class ValidatePasswordMatch implements ValidatorProtocol {
  constructor (
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly hasher: ComparerProtocol
  ) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email, password } = input

    const user = (await this.userDbRepository.findUserByEmail(email)) as User
    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(password, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
