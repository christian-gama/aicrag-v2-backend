import { IUser } from '@/domain'
import { DecoderProtocol } from '@/domain/cryptography'
import { VerifyTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

import { TokenMissingError, InvalidTokenError } from '@/application/errors'

export class VerifyRefreshToken implements VerifyTokenProtocol {
  constructor (
    private readonly refreshTokenDecoder: DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async verify (token: string | undefined): Promise<InvalidTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedRefreshToken = await this.refreshTokenDecoder.decode(token)

    if (decodedRefreshToken instanceof Error) return decodedRefreshToken

    const user = await this.userDbRepository.findUserById(decodedRefreshToken.userId)

    if (user == null) return new InvalidTokenError()

    if (user.tokenVersion !== +decodedRefreshToken.version) {
      return new InvalidTokenError()
    }

    return user
  }
}
