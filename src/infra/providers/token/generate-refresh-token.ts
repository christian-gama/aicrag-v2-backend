import { IUser } from '@/domain/user/index'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { UserDbFilter } from '@/infra/database/mongodb/user/protocols/update-user-options'

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
