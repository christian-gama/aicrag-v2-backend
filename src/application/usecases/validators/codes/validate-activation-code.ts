import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'

export class ValidateActivationCode implements ValidatorProtocol {
  constructor (private readonly accountDbRepository: AccountDbRepositoryProtocol) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email } = input

    await this.accountDbRepository.findAccountByEmail(email)

    return undefined
  }
}
