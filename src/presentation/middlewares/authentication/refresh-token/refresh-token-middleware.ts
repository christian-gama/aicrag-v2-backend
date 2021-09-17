import { ComparerProtocol } from '@/application/protocols/cryptography'
import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import {
  HttpHelperProtocol,
  HttpRequestToken,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'
export class RefreshTokenMiddleware implements MiddlewareProtocol {
  constructor (
    private readonly comparer: ComparerProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol,
    private readonly jwtRefreshToken: DecoderProtocol,
    private readonly refreshTokenDbRepository: RefreshTokenDbRepositoryProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
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

    const refreshTokenOwner = await this.userDbRepository.findUserByRefreshToken(
      existentRefreshToken.id
    )

    if (!refreshTokenOwner) return this.httpHelper.unauthorized(new TokenMissingError())

    const isSameOwner = await this.comparer.compare(
      refreshTokenOwner.personal.id,
      existentRefreshToken.userId
    )

    if (!isSameOwner) return this.httpHelper.unauthorized(new InvalidTokenError())

    if (existentRefreshToken.expiresIn.getTime() < Date.now()) {
      await this.refreshTokenDbRepository.deleteRefreshTokenById(existentRefreshToken.userId)

      return this.httpHelper.unauthorized(new TokenMissingError())
    }

    const accessToken = this.jwtAccessToken.encrypt('id', existentRefreshToken.userId)

    return this.httpHelper.ok({ refreshToken, accessToken })
  }
}
