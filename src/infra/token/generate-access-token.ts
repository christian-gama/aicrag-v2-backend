import { IUser } from '@/domain'
import { IEncrypter } from '@/domain/cryptography'
import { IGenerateToken } from '@/domain/providers'

export class GenerateAccessToken implements IGenerateToken {
  constructor (private readonly accessTokenEncrypter: IEncrypter) {}

  generate (user: IUser): string {
    return this.accessTokenEncrypter.encrypt({
      userId: user.personal.id
    })
  }
}
