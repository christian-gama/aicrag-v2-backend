import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { IUser } from '@/domain'
import { InactiveAccountError } from '../errors'

export class ValidateActiveAccount implements ValidatorProtocol {
  constructor (private readonly userDbRepository: UserDbRepositoryProtocol) {}

  async validate (input: any): Promise<InactiveAccountError | undefined> {
    const { email } = input

    const user = (await this.userDbRepository.findUserByEmail(email)) as IUser

    if (!user.settings.accountActivated) return new InactiveAccountError()
  }
}
