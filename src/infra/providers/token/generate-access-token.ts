import { IUser } from '@/domain'

import { EncrypterProtocol } from '@/application/protocols/cryptography'
import { GenerateTokenProtocol } from '@/application/protocols/providers'

export class GenerateAccessToken implements GenerateTokenProtocol {
  constructor (private readonly accessTokenEncrypter: EncrypterProtocol) {}

  generate (user: IUser): string {
    return this.accessTokenEncrypter.encrypt({
      userId: user.personal.id
    })
  }
}
