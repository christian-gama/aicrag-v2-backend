import { EncrypterProtocol } from '@/application/protocols/cryptography'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { IUser } from '@/domain'
import { UserDbFilter } from '@/infra/database/mongodb/protocols'

export class GenerateRefreshToken implements GenerateTokenProtocol {
  constructor (
    private readonly jwtRefreshToken: EncrypterProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async generate (user: IUser): Promise<string> {
    const userUpdate: UserDbFilter = { tokenVersion: ++user.tokenVersion }
    await this.userDbRepository.updateUser(user, userUpdate)

    return this.jwtRefreshToken.encrypt({
      userId: user.personal.id,
      version: user.tokenVersion.toString()
    })
  }
}
