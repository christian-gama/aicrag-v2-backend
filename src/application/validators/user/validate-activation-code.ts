import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { InvalidCodeError, AccountAlreadyActivatedError, CodeIsExpiredError, InvalidTypeError } from '../../errors'

export class ValidateActivationCode implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (
    input: any
  ): Promise<AccountAlreadyActivatedError | CodeIsExpiredError | InvalidCodeError | InvalidTypeError | undefined> {
    const { email, activationCode } = input

    if (typeof activationCode !== 'string') return new InvalidTypeError('activationCode')

    const user = await this.userRepository.findByEmail(email)
    if (!user) return new InvalidCodeError()

    if (user.temporary.activationCodeExpiration == null) return new InvalidCodeError()
    if (activationCode !== user.temporary.activationCode) return new InvalidCodeError()
    if (user.settings.accountActivated) return new AccountAlreadyActivatedError()
    if (user.temporary.activationCodeExpiration.getTime() < Date.now()) {
      return new CodeIsExpiredError()
    }
  }
}
