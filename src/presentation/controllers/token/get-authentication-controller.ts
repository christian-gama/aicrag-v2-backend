import { IEncrypter } from '@/domain/cryptography'
import { IVerifyToken } from '@/domain/providers'
import { getToken } from '@/infra/token'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class GetAuthenticationController implements IController {
  constructor (
    private readonly accessTokenEncrypter: IEncrypter,
    private readonly httpHelper: IHttpHelper,
    private readonly verifyAccessToken: IVerifyToken,
    private readonly verifyRefreshToken: IVerifyToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    let authentication: 'partial' | 'protected' | 'none' = 'none'

    let accessToken = getToken.accessToken(httpRequest)
    const decodedAccessToken = await this.verifyAccessToken.verify(accessToken)
    let isValidAccessToken: boolean = !(decodedAccessToken instanceof Error)

    const refreshToken = getToken.refreshToken(httpRequest)
    const decodedRefreshToken = await this.verifyRefreshToken.verify(refreshToken)
    const isValidRefreshToken: boolean = !(decodedRefreshToken instanceof Error)

    if (
      decodedAccessToken instanceof Error &&
      decodedAccessToken.name === 'ExpiredTokenError' &&
      !(decodedRefreshToken instanceof Error)
    ) {
      accessToken = this.accessTokenEncrypter.encrypt({
        userId: decodedRefreshToken.personal.id
      })
      isValidAccessToken = true
    }

    if (isValidAccessToken && isValidRefreshToken) authentication = 'protected'
    else if (isValidAccessToken && !isValidRefreshToken) authentication = 'partial'

    const result = this.httpHelper.ok({ accessToken, authentication, refreshToken })

    return result
  }
}
