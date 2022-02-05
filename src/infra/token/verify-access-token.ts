import { IUser } from '@/domain'
import { IDecoder } from '@/domain/cryptography'
import { IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { TokenMissingError, InvalidTokenError, ExpiredTokenError } from '@/application/errors'

export class VerifyAccessToken implements IVerifyToken {
  constructor (private readonly accessTokenDecoder: IDecoder, private readonly userRepository: IUserRepository) {}

  async verify (token: any): Promise<InvalidTokenError | ExpiredTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedAccessToken = await this.accessTokenDecoder.decode(token)

    if (decodedAccessToken instanceof Error) return decodedAccessToken

    const result = await this.userRepository.findById(decodedAccessToken.userId)
    if (!result) return new InvalidTokenError()

    return result
  }
}
