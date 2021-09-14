import { User } from '@/domain/user'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { InactiveAccountError } from '@/application/usecases/errors'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'

export class ValidateActiveAccount implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email } = input

    const user = (await this.userDbRepository.findUserByEmail(email)) as User

    if (!user.settings.accountActivated) return new InactiveAccountError()
  }
}
