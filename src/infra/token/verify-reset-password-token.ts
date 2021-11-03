import { IUser } from '@/domain'
import { IDecoder } from '@/domain/cryptography'
import { IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { TokenMissingError, InvalidTokenError } from '@/application/errors'

export class VerifyResetPasswordToken implements IVerifyToken {
  constructor (private readonly accessTokenDecoder: IDecoder, private readonly userRepository: IUserRepository) {}

  async verify (token: any): Promise<InvalidTokenError | IUser> {
    if (!token) {
      return new TokenMissingError()
    }

    const decodedAccessToken = await this.accessTokenDecoder.decode(token)

    if (decodedAccessToken instanceof Error) return decodedAccessToken

    const result = await this.userRepository.findById(decodedAccessToken.userId)
    if (!result) return new InvalidTokenError()

    if (result.temporary.resetPasswordToken !== token) {
      return new InvalidTokenError()
    }

    return result
  }
}
