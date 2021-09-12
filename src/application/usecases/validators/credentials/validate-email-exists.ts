import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { UserCredentialError } from '../../errors'

export class ValidateEmailExists implements ValidatorProtocol {
  constructor (private readonly accountDbRepository: AccountDbRepositoryProtocol) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email } = input

    const user = await this.accountDbRepository.findAccountByEmail(email)

    if (!user) return new UserCredentialError()
  }
}
