import { DecoderProtocol } from '@/application/protocols/cryptography'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import { IUser } from '@/domain'
import { VerifyTokenProtocol } from '../../../application/protocols/providers'

export class VerifyAccessToken implements VerifyTokenProtocol {
  constructor (
    private readonly jwtAccessToken: DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async verify (token: string | undefined): Promise<Error | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedAccessToken = await this.jwtAccessToken.decode(token)

    const user = await this.userDbRepository.findUserById(decodedAccessToken.userId)

    if (!user) return new InvalidTokenError()

    return user
  }
}
