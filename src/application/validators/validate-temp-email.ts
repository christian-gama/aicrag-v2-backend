import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { UserCredentialError } from '../errors'

export class ValidateTempEmail implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { email } = input

    const user = await this.userDbRepository.findUserByEmail(email)

    if (user == null) return new UserCredentialError()

    if (!user.temporary.tempEmail) return new UserCredentialError()
  }
}
