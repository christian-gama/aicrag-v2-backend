import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'

import { InvalidCodeError, CodeIsExpiredError } from '../errors'

export class ValidateEmailCode implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (
    input: any
  ): Promise<InvalidCodeError | CodeIsExpiredError | undefined> {
    const { email, tempEmailCode } = input
    const user = await this.userDbRepository.findUserByEmail(email)

    if (user == null) return new InvalidCodeError()

    if (user.temporary.tempEmailCodeExpiration == null) return new InvalidCodeError()
    if (tempEmailCode !== user.temporary.tempEmailCode) return new InvalidCodeError()
    if (!user.temporary.tempEmail) return new InvalidCodeError()
    if (user.temporary.tempEmailCodeExpiration.getTime() < Date.now()) return new CodeIsExpiredError()
  }
}
