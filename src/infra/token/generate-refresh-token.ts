import { IUser } from '@/domain'
import { EncrypterProtocol } from '@/domain/cryptography'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserRepositoryProtocol } from '@/domain/repositories'

export class GenerateRefreshToken implements GenerateTokenProtocol {
  constructor (
    private readonly refreshTokenEncrypter: EncrypterProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async generate (user: IUser): Promise<string> {
    await this.userRepository.updateUser(user.personal.id, { tokenVersion: ++user.tokenVersion })

    return this.refreshTokenEncrypter.encrypt({
      userId: user.personal.id,
      version: user.tokenVersion.toString()
    })
  }
}
