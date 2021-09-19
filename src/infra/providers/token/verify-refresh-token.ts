import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import { IUser } from '@/domain/user/index'
import { VerifyTokenProtocol } from './protocols/verify-token-protocol'

export class VerifyRefreshToken implements VerifyTokenProtocol {
  constructor (
    private readonly jwtRefreshToken: DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async verify (token: string | undefined): Promise<Error | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedRefreshToken = await this.jwtRefreshToken.decode(token)

    const user = await this.userDbRepository.findUserById(decodedRefreshToken.userId)

    if (!user) return new InvalidTokenError()

    if (user.tokenVersion !== +decodedRefreshToken.version) {
      return new InvalidTokenError()
    }

    return user
  }
}
