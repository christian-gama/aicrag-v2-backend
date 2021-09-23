import { DecoderProtocol, EncrypterProtocol } from '@/application/protocols/cryptography'
import { VerifyTokenProtocol } from '@/application/protocols/providers'
import {
  HttpHelperProtocol,
  HttpRequestToken,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'
export class RefreshToken implements MiddlewareProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol & DecoderProtocol,
    private readonly verifyRefreshToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequestToken): Promise<HttpResponse> {
    const { refreshToken } = httpRequest

    const response = await this.verifyRefreshToken.verify(refreshToken)

    if (response instanceof Error) return this.httpHelper.unauthorized(response)

    const accessToken = this.jwtAccessToken.encrypt({ userId: response.personal.id })

    return this.httpHelper.ok({ refreshToken, accessToken })
  }
}
