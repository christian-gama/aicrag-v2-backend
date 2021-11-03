import { IEncrypter } from '@/domain/cryptography'
import { IVerifyToken } from '@/domain/providers'
import { ExpiredTokenError, InvalidTokenError, TokenMissingError } from '@/application/errors'
import { getToken } from '@/infra/token'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from './protocols/middleware-protocol'

export class ProtectedMiddleware implements IMiddleware {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly accessTokenEncrypter: IEncrypter,
    private readonly verifyAccessToken: IVerifyToken,
    private readonly verifyRefreshToken: IVerifyToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const refreshToken = getToken.refreshToken(httpRequest)

    const refreshTokenResponse = await this.verifyRefreshToken.verify(refreshToken)

    if (refreshTokenResponse instanceof Error) {
      return this.httpHelper.unauthorized(refreshTokenResponse)
    }

    let accessToken = getToken.accessToken(httpRequest)

    const accessTokenResponse = await this.verifyAccessToken.verify(accessToken)

    switch (accessTokenResponse.constructor) {
      case InvalidTokenError:
        return this.httpHelper.unauthorized(accessTokenResponse as Error)
      case TokenMissingError:
        return this.httpHelper.unauthorized(accessTokenResponse as Error)
      case ExpiredTokenError:
        accessToken = this.accessTokenEncrypter.encrypt({
          userId: refreshTokenResponse.personal.id
        })
        break
    }

    const result = this.httpHelper.ok({ accessToken, refreshToken })

    return result
  }
}
