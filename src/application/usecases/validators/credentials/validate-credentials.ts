import { ComparerProtocol } from '@/application/protocols/cryptography'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { User } from '@/domain/user'
import { UserCredentialError } from '../../errors'

export class ValidateCredentials implements ValidatorProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly hasher: ComparerProtocol
  ) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email, password } = input

    const user = await this.userExists(email)
    if (!user) return new UserCredentialError()

    const passwordMatches = await this.passwordMatch(password, user)
    if (!passwordMatches) return new UserCredentialError()
  }

  private async userExists (email: string): Promise<User | undefined> {
    const user = await this.accountDbRepository.findAccountByEmail(email)

    return user
  }

  private async passwordMatch (password: string, user: User): Promise<boolean> {
    return await this.hasher.compare(password, user.personal.password)
  }
}
