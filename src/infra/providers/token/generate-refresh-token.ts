import { EncrypterProtocol } from '@/application/protocols/cryptography'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { IUser } from '@/domain'

export class GenerateRefreshToken implements GenerateTokenProtocol {
  constructor (
    private readonly jwtRefreshToken: EncrypterProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async generate (user: IUser): Promise<string> {
    await this.userDbRepository.updateUser(user, { tokenVersion: ++user.tokenVersion })

    return this.jwtRefreshToken.encrypt({
      userId: user.personal.id,
      version: user.tokenVersion.toString()
    })
  }
}
