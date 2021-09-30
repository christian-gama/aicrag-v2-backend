import { IUser } from '@/domain'
import { DecoderProtocol } from '@/domain/cryptography'
import { VerifyTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

import { TokenMissingError, InvalidTokenError } from '@/application/errors'

export class VerifyAccessToken implements VerifyTokenProtocol {
  constructor (
    private readonly accessTokenDecoder: DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async verify (token: string | undefined): Promise<InvalidTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedAccessToken = await this.accessTokenDecoder.decode(token)

    if (decodedAccessToken instanceof Error) return decodedAccessToken

    const user = await this.userDbRepository.findUserById(decodedAccessToken.userId)

    if (user == null) return new InvalidTokenError()

    return user
  }
}
