import { DecodedProtocol, DecoderProtocol } from '@/application/protocols/cryptography'
import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { TokenMissingError, InvalidTokenError } from '@/application/usecases/errors'
import { IUser } from '@/domain'

export class VerifyResetPasswordToken implements VerifyTokenProtocol {
  constructor (
    private readonly jwtAccessToken: DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async verify (token: string | undefined): Promise<InvalidTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    let decodedAccessToken: DecodedProtocol
    try {
      decodedAccessToken = await this.jwtAccessToken.decode(token)
    } catch (error) {
      return new InvalidTokenError()
    }

    const user = await this.userDbRepository.findUserById(decodedAccessToken.userId)

    if (!user) return new InvalidTokenError()

    if (user.temporary.resetPasswordToken !== token) {
      return new InvalidTokenError()
    }

    return user
  }
}
