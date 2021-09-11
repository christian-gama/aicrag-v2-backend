import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { User } from '@/domain/user'
import { InactiveAccountError } from '../../errors'

export class ValidateActiveAccount implements ValidatorProtocol {
  constructor (private readonly accountDbRepository: AccountDbRepositoryProtocol) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email } = input

    const user = (await this.accountDbRepository.findAccountByEmail(email)) as User

    if (!user.settings.accountActivated) return new InactiveAccountError()
  }
}
