import { IUser } from '@/domain'

import { EncrypterProtocol } from '@/application/protocols/cryptography'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'

export class GenerateRefreshToken implements GenerateTokenProtocol {
  constructor (
    private readonly refreshTokenEncrypter: EncrypterProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async generate (user: IUser): Promise<string> {
    await this.userDbRepository.updateUser(user, { tokenVersion: ++user.tokenVersion })

    return this.refreshTokenEncrypter.encrypt({
      userId: user.personal.id,
      version: user.tokenVersion.toString()
    })
  }
}
