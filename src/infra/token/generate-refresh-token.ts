import { IUser } from '@/domain'
import { IEncrypter } from '@/domain/cryptography'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'

export class GenerateRefreshToken implements IGenerateToken {
  constructor (private readonly refreshTokenEncrypter: IEncrypter, private readonly userRepository: IUserRepository) {}

  async generate (user: IUser): Promise<string> {
    await this.userRepository.updateUser(user.personal.id, { tokenVersion: ++user.tokenVersion })

    return this.refreshTokenEncrypter.encrypt({
      userId: user.personal.id,
      version: user.tokenVersion.toString()
    })
  }
}
