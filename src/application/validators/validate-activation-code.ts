import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { InvalidCodeError, AccountAlreadyActivatedError, CodeIsExpiredError } from '../errors'

export class ValidateActivationCode implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (
    input: any
  ): Promise<InvalidCodeError | CodeIsExpiredError | AccountAlreadyActivatedError | undefined> {
    const { email, activationCode } = input
    const user = await this.userDbRepository.findUserByEmail(email)

    if (user == null) return new InvalidCodeError()

    if (user.temporary.activationCodeExpiration == null) return new InvalidCodeError()
    if (activationCode !== user.temporary.activationCode) return new InvalidCodeError()
    if (user.settings.accountActivated) return new AccountAlreadyActivatedError()
    if (user.temporary.activationCodeExpiration.getTime() < Date.now()) { return new CodeIsExpiredError() }
  }
}
