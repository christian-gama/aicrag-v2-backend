import { IUser } from '@/domain'

import { DecoderProtocol } from '@/application/protocols/cryptography'
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

    const decodedRefreshToken = await this.jwtRefreshToken.decode(token)

    if (decodedRefreshToken instanceof Error) return decodedRefreshToken

    const user = await this.userDbRepository.findUserById(decodedRefreshToken.userId)

    if (!user) return new InvalidTokenError()

    if (user.tokenVersion !== +decodedRefreshToken.version) {
      return new InvalidTokenError()
    }

    return user
  }
}
