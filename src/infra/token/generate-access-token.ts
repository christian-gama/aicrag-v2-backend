import { IUser } from '@/domain'
import { EncrypterProtocol } from '@/domain/cryptography'
import { GenerateTokenProtocol } from '@/domain/providers'

export class GenerateAccessToken implements GenerateTokenProtocol {
  constructor (private readonly accessTokenEncrypter: EncrypterProtocol) {}

  generate (user: IUser): string {
    return this.accessTokenEncrypter.encrypt({
      userId: user.personal.id
    })
  }
}
