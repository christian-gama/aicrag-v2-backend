import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { TokenMissingError } from '@/application/usecases/errors'
import {
  HttpHelperProtocol,
  HttpRequestToken,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

export class RefreshTokenMiddleware implements MiddlewareProtocol {
  constructor (
    private readonly decoder: DecoderProtocol,
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequestToken): Promise<HttpResponse> {
    const { token } = httpRequest

    if (!token) {
      return this.httpHelper.unauthorized(new TokenMissingError())
    }

    await this.decoder.decodeId(token)

    return { statusCode: 200, status: 'success', data: '' }
  }
}
