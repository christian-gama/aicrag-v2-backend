import { IVerifyToken } from '@/domain/providers'
import { getToken } from '@/infra/token'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class GetAuthenticationController implements IController {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly verifyAccessToken: IVerifyToken,
    private readonly verifyRefreshToken: IVerifyToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    let authentication: 'partial' | 'protected' | 'none' = 'none'

    const accessToken = getToken.accessToken(httpRequest)
    const isValidAccessToken = !((await this.verifyAccessToken.verify(accessToken)) instanceof Error)

    const refreshToken = getToken.refreshToken(httpRequest)
    const isValidRefreshToken = !((await this.verifyRefreshToken.verify(refreshToken)) instanceof Error)

    if (isValidAccessToken && isValidRefreshToken) authentication = 'protected'
    else if (isValidAccessToken && !isValidRefreshToken) authentication = 'partial'

    const result = this.httpHelper.ok({ authentication })

    return result
  }
}
