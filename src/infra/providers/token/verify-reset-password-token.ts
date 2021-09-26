import { IUser } from '@/domain'

import { DecoderProtocol } from '@/application/protocols/cryptography'
import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { TokenMissingError, InvalidTokenError } from '@/application/usecases/errors'

export class VerifyResetPasswordToken implements VerifyTokenProtocol {
  constructor (
    private readonly jwtAccessToken: DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async verify (token: string | undefined): Promise<InvalidTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedAccessToken = await this.jwtAccessToken.decode(token)

    if (decodedAccessToken instanceof Error) return decodedAccessToken

    const user = await this.userDbRepository.findUserById(decodedAccessToken.userId)

    if (!user) return new InvalidTokenError()

    if (user.temporary.resetPasswordToken !== token) {
      return new InvalidTokenError()
    }

    return user
  }
}
