import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { AccountAlreadyActivatedError, CodeIsExpiredError, InvalidCodeError } from '../../errors'

export class ValidateActivationCode implements ValidatorProtocol {
  constructor (private readonly accountDbRepository: AccountDbRepositoryProtocol) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email, activationCode } = input
    const user = await this.accountDbRepository.findAccountByEmail(email)

    if (!user) return new InvalidCodeError()

    if (user.settings.accountActivated) return new AccountAlreadyActivatedError()

    if (!user.temporary.activationCodeExpiration) return new InvalidCodeError()

    if (user.temporary.activationCodeExpiration.getTime() < Date.now()) return new CodeIsExpiredError()

    if (activationCode !== user.temporary.activationCode) return new InvalidCodeError()
  }
}
