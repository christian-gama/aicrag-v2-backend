import { IUser } from '@/domain'
import { IDecoder } from '@/domain/cryptography'
import { IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'

import { TokenMissingError, InvalidTokenError } from '@/application/errors'

export class VerifyRefreshToken implements IVerifyToken {
  constructor (private readonly refreshTokenDecoder: IDecoder, private readonly userRepository: IUserRepository) {}

  async verify (token: any): Promise<InvalidTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedRefreshToken = await this.refreshTokenDecoder.decode(token)

    if (decodedRefreshToken instanceof Error) return decodedRefreshToken

    const user = await this.userRepository.findUserById(decodedRefreshToken.userId)

    if (user == null) return new InvalidTokenError()

    if (user.tokenVersion !== +decodedRefreshToken.version) {
      return new InvalidTokenError()
    }

    return user
  }
}
