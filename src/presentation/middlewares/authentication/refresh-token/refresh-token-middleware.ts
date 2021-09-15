import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { TokenMissingError } from '@/application/usecases/errors'
import {
  HttpHelperProtocol,
  HttpRequestToken,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'
export class RefreshTokenMiddleware implements MiddlewareProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol,
    private readonly jwtRefreshToken: DecoderProtocol,
    private readonly refreshTokenDbRepository: RefreshTokenDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequestToken): Promise<HttpResponse> {
    const { refreshToken } = httpRequest

    if (!refreshToken) {
      return this.httpHelper.unauthorized(new TokenMissingError())
    }

    const decodedRefreshToken = await this.jwtRefreshToken.decode(refreshToken)

    const existentRefreshToken = await this.refreshTokenDbRepository.findRefreshTokenById(
      decodedRefreshToken.id
    )

    if (!existentRefreshToken) return this.httpHelper.unauthorized(new TokenMissingError())

    if (existentRefreshToken.expiresIn.getTime() < Date.now()) {
      await this.refreshTokenDbRepository.deleteRefreshTokenById(existentRefreshToken.userId)

      return this.httpHelper.unauthorized(new TokenMissingError())
    }

    const accessToken = this.jwtAccessToken.encrypt('id', existentRefreshToken.userId)

    return this.httpHelper.ok({ refreshToken, accessToken })
  }
}
