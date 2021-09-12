import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'

export class ValidateActivationCode implements ValidatorProtocol {
  constructor (private readonly accountDbRepository: AccountDbRepositoryProtocol) {}

  async validate (email: any): Promise<Error | undefined> {
    await this.accountDbRepository.findAccountByEmail(email)

    return Promise.resolve(undefined)
  }
}
