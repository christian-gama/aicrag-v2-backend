import { EncrypterProtocol } from '@/application/protocols/cryptography'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { IUser } from '@/domain'

export class GenerateAccessToken implements GenerateTokenProtocol {
  constructor (private readonly jwtAccessToken: EncrypterProtocol) {}

  generate (user: IUser): string {
    return this.jwtAccessToken.encrypt({
      userId: user.personal.id
    })
  }
}
