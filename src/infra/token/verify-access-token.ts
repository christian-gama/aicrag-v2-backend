import { IUser } from '@/domain'
import { DecoderProtocol } from '@/domain/cryptography'
import { VerifyTokenProtocol } from '@/domain/providers'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { TokenMissingError, InvalidTokenError } from '@/application/errors'

export class VerifyAccessToken implements VerifyTokenProtocol {
  constructor (
    private readonly accessTokenDecoder: DecoderProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async verify (token: any): Promise<InvalidTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedAccessToken = await this.accessTokenDecoder.decode(token)

    if (decodedAccessToken instanceof Error) return decodedAccessToken

    const user = await this.userRepository.findUserById(decodedAccessToken.userId)

    if (user == null) return new InvalidTokenError()

    return user
  }
}
