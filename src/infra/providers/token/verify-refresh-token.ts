import { IUser } from '@/domain'

import { DecoderProtocol } from '@/application/protocols/cryptography'
import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { TokenMissingError, InvalidTokenError } from '@/application/usecases/errors'

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
