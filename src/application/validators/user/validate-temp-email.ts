import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { UserCredentialError } from '../../errors'

export class ValidateTempEmail implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { email } = input

    const user = await this.userRepository.findUserByEmail(email)
    if (!user) return new UserCredentialError()

    if (!user.temporary.tempEmail) return new UserCredentialError()
  }
}
