import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken, IVerifyToken } from '@/domain/providers'
import { getToken } from '@/infra/token'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class GetAuthenticationController implements IController {
  constructor (
    private readonly filterUserData: IFilterUserData,
    private readonly generateAccessToken: IGenerateToken,
    private readonly httpHelper: IHttpHelper,
    private readonly verifyAccessToken: IVerifyToken,
    private readonly verifyRefreshToken: IVerifyToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
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
      accessToken = await this.generateAccessToken.generate(decodedRefreshToken)
      isValidAccessToken = true
    }

    let result = this.httpHelper.ok({ authentication })
    if (isValidAccessToken) {
      if (isValidRefreshToken && user) {
        authentication = 'protected'
        result = this.httpHelper.ok({
          accessToken,
          authentication,
          refreshToken,
          user: this.filterUserData.filter(user)
        })
      } else if (!isValidRefreshToken) {
        authentication = 'partial'
        result = this.httpHelper.ok({ accessToken, authentication })
      }
    }

    return result
  }
}
