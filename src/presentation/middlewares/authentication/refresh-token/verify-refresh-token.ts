import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import {
  HttpHelperProtocol,
  HttpRequestToken,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'
export class VerifyRefreshToken implements MiddlewareProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol & DecoderProtocol,
    private readonly jwtRefreshToken: DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequestToken): Promise<HttpResponse> {
    const { refreshToken } = httpRequest

    if (!refreshToken) {
      return this.httpHelper.unauthorized(new TokenMissingError())
    }

    const decodedRefreshToken = await this.jwtRefreshToken.decode(refreshToken)

    const user = await this.userDbRepository.findUserById(decodedRefreshToken.userId)

    if (!user) return this.httpHelper.unauthorized(new InvalidTokenError())

    if (user.tokenVersion !== +decodedRefreshToken.version) {
      return this.httpHelper.unauthorized(new InvalidTokenError())
    }

    const accessToken = this.jwtAccessToken.encrypt({ userId: user.personal.id })

    return this.httpHelper.ok({ refreshToken, accessToken })
  }
}
