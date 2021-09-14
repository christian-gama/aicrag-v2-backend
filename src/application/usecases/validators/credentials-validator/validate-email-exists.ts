import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { UserCredentialError } from '../../errors'

export class ValidateEmailExists implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email } = input

    const user = await this.userDbRepository.findUserByEmail(email)

    if (!user) return new UserCredentialError()
  }
}
