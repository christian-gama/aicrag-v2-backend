import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { InactiveAccountError } from '../../errors'

export class ValidateActiveAccount implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (input: any): Promise<InactiveAccountError | undefined> {
    const { email } = input

    const user = (await this.userRepository.findUserByEmail(email)) as IUser

    if (!user.settings.accountActivated) return new InactiveAccountError()
  }
}
