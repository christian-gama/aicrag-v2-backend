import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'

import { UserCredentialError } from '../errors'

export class ValidateEmailExists implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { email } = input

    const user = await this.userDbRepository.findUserByEmail(email)

    if (user == null) return new UserCredentialError()
  }
}
