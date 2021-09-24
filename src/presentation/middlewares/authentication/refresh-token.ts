import { EncrypterProtocol, DecoderProtocol } from '@/application/protocols/cryptography'
import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '../protocols/middleware-protocol'

export class RefreshToken implements MiddlewareProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol & DecoderProtocol,
    private readonly verifyRefreshToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { refreshToken } = httpRequest

    const response = await this.verifyRefreshToken.verify(refreshToken)

    if (response instanceof Error) return this.httpHelper.unauthorized(response)

    const accessToken = this.jwtAccessToken.encrypt({ userId: response.personal.id })

    return this.httpHelper.ok({ refreshToken, accessToken })
  }
}
