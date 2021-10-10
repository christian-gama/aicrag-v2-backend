import { IUser } from '@/domain'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { InactiveAccountError } from '../../errors'

export class ValidateActiveAccount implements ValidatorProtocol {
  constructor (private readonly userRepository: UserRepositoryProtocol) {}

  async validate (input: any): Promise<InactiveAccountError | undefined> {
    const { email } = input

    const user = (await this.userRepository.findUserByEmail(email)) as IUser

    if (!user.settings.accountActivated) return new InactiveAccountError()
  }
}
