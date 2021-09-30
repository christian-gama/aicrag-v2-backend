import { EncrypterProtocol } from '@/domain/cryptography'
import { VerifyTokenProtocol } from '@/domain/providers'

import {
  ExpiredTokenError,
  InvalidTokenError,
  TokenMissingError
} from '@/application/errors'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/http/protocols'

import { MiddlewareProtocol } from './protocols/middleware-protocol'

export class ProtectedMiddleware implements MiddlewareProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly accessTokenEncrypter: EncrypterProtocol,
    private readonly verifyAccessToken: VerifyTokenProtocol,
    private readonly verifyRefreshToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const refreshToken = httpRequest.cookies?.refreshToken

    const refreshTokenResponse = await this.verifyRefreshToken.verify(refreshToken)

    if (refreshTokenResponse instanceof Error) {
      return this.httpHelper.unauthorized(refreshTokenResponse)
    }

    let accessToken = httpRequest.cookies?.accessToken

    const accessTokenResponse = await this.verifyAccessToken.verify(accessToken)

    switch (accessTokenResponse.constructor) {
      case InvalidTokenError:
        return this.httpHelper.unauthorized(accessTokenResponse as Error)
      case TokenMissingError:
        return this.httpHelper.unauthorized(accessTokenResponse as Error)
      case ExpiredTokenError:
        accessToken = this.accessTokenEncrypter.encrypt({ userId: refreshTokenResponse.personal.id })
        break
    }

    return this.httpHelper.ok({ accessToken, refreshToken })
  }
}
