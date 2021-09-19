import { IUser } from '@/domain/user/index'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'

export class GenerateAccessToken implements GenerateTokenProtocol {
  constructor (private readonly jwtAccessToken: EncrypterProtocol) {}

  generate (user: IUser): string {
    return this.jwtAccessToken.encrypt({
      userId: user.personal.id
    })
  }
}
