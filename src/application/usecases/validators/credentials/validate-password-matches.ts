import { User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ComparerProtocol } from '@/application/protocols/cryptography'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { UserCredentialError } from '../../errors'

export class ValidatePasswordMatches implements ValidatorProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly hasher: ComparerProtocol
  ) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email, password } = input

    const user = (await this.accountDbRepository.findAccountByEmail(email)) as User
    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(password, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
