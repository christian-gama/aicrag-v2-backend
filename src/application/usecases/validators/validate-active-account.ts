import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { InactiveAccountError } from '@/application/usecases/errors'
import { ValidatorProtocol } from '@/application/protocols/validators'

export class ValidateActiveAccount implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (input: any): Promise<Error | undefined> {
    const { email } = input

    const user = (await this.userDbRepository.findUserByEmail(email)) as IUser

    if (!user.settings.accountActivated) return new InactiveAccountError()
  }
}
