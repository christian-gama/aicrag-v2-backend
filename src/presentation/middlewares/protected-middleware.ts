import { IGenerateToken, IVerifyToken } from '@/domain/providers'
import { ExpiredTokenError, InvalidTokenError, TokenMissingError } from '@/application/errors'
import { getToken } from '@/infra/token'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from './protocols/middleware.model'

export class ProtectedMiddleware implements IMiddleware {
  constructor (
    private readonly generateAccessToken: IGenerateToken,
    private readonly httpHelper: IHttpHelper,
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
        accessToken = await this.generateAccessToken.generate(refreshTokenResponse)
    }

    const result = this.httpHelper.ok({ accessToken, refreshToken })

    return result
  }
}
