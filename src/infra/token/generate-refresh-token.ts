import { IUser } from '@/domain'
import { EncrypterProtocol } from '@/domain/cryptography'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

export class GenerateRefreshToken implements GenerateTokenProtocol {
  constructor (
    private readonly refreshTokenEncrypter: EncrypterProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async generate (user: IUser): Promise<string> {
    await this.userDbRepository.updateUser(user.personal.id, { tokenVersion: ++user.tokenVersion })

    return this.refreshTokenEncrypter.encrypt({
      userId: user.personal.id,
      version: user.tokenVersion.toString()
    })
  }
}
