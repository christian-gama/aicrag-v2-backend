import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
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
    private readonly httpHelper: HttpHelperProtocol,
    private readonly refreshTokenDbRepository: RefreshTokenDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequestToken): Promise<HttpResponse> {
    const { token } = httpRequest

    if (!token) {
      return this.httpHelper.unauthorized(new TokenMissingError())
    }

    const userId = await this.decoder.decodeId(token)

    const refreshToken = await this.refreshTokenDbRepository.findRefreshTokenByUserId(userId)

    if (!refreshToken || refreshToken.expiresIn.getTime() < Date.now()) {
      await this.refreshTokenDbRepository.saveRefreshToken(userId)
    }

    return { statusCode: 200, status: 'success', data: '' }
  }
}
