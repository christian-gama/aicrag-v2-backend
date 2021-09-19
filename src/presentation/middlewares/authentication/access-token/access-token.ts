import { VerifyTokenProtocol } from '@/application/protocols/providers/verify-token-protocol'
import {
  HttpHelperProtocol,
  HttpRequestToken,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'
export class AccessToken implements MiddlewareProtocol {
  constructor (private readonly httpHelper: HttpHelperProtocol, private readonly verifyAccessToken: VerifyTokenProtocol) {}

  async handle (httpRequest: HttpRequestToken): Promise<HttpResponse> {
    const { accessToken } = httpRequest

    const response = await this.verifyAccessToken.verify(accessToken)

    if (response instanceof Error) return this.httpHelper.unauthorized(response)

    return this.httpHelper.ok({ accessToken })
  }
}
