import { IUser } from '@/domain'

import { DecodedProtocol, DecoderProtocol } from '@/application/protocols/cryptography'
import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { TokenMissingError, InvalidTokenError } from '@/application/usecases/errors'

export class VerifyRefreshToken implements VerifyTokenProtocol {
  constructor (
    private readonly jwtRefreshToken: DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async verify (token: string | undefined): Promise<InvalidTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    let decodedRefreshToken: DecodedProtocol
    try {
      decodedRefreshToken = await this.jwtRefreshToken.decode(token)
    } catch (error) {
      return new InvalidTokenError()
    }

    const user = await this.userDbRepository.findUserById(decodedRefreshToken.userId)

    if (!user) return new InvalidTokenError()

    if (user.tokenVersion !== +decodedRefreshToken.version) {
      return new InvalidTokenError()
    }

    return user
  }
}
