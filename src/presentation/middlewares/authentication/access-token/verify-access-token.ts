import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import {
  HttpHelperProtocol,
  HttpRequestToken,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'
export class VerifyAccessToken implements MiddlewareProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol & DecoderProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequestToken): Promise<HttpResponse> {
    const { accessToken } = httpRequest

    if (!accessToken) {
      return this.httpHelper.unauthorized(new TokenMissingError())
    }

    const decodedAccessToken = await this.jwtAccessToken.decode(accessToken)

    const user = await this.userDbRepository.findUserById(decodedAccessToken.userId)

    if (!user) return this.httpHelper.unauthorized(new InvalidTokenError())

    return this.httpHelper.ok({ accessToken })
  }
}
