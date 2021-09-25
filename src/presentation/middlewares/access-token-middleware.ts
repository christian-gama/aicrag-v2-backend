import { VerifyTokenProtocol } from '@/application/protocols/providers'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'

import { MiddlewareProtocol } from './protocols/middleware-protocol'

export class AccessTokenMiddleware implements MiddlewareProtocol {
  constructor (private readonly httpHelper: HttpHelperProtocol, private readonly verifyAccessToken: VerifyTokenProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.cookies?.accessToken

    const response = await this.verifyAccessToken.verify(accessToken)

    if (response instanceof Error) return this.httpHelper.unauthorized(response)

    return this.httpHelper.ok({ accessToken })
  }
}
