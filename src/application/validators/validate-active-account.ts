import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { InactiveAccountError } from '../errors'

export class ValidateActiveAccount implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (input: any): Promise<InactiveAccountError | undefined> {
    const { email } = input

    const user = (await this.userDbRepository.findUserByEmail(email)) as IUser

    if (!user.settings.accountActivated) return new InactiveAccountError()
  }
}
