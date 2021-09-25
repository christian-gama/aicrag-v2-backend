import { VerifyTokenProtocol } from '@/application/protocols/providers'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '../helpers/http/protocols'
import { MiddlewareProtocol } from './protocols/middleware-protocol'

export class IsLoggedInMiddleware implements MiddlewareProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly verifyRefreshToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = await this.verifyRefreshToken.verify(httpRequest.cookies?.refreshToken)

    if (user instanceof Error) return this.httpHelper.ok({ user: undefined })

    return this.httpHelper.ok({ user })
  }
}
