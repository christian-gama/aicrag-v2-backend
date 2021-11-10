import { IVerifyToken } from '@/domain/providers'
import { getToken } from '@/infra/token'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from './protocols/middleware.model'

export class PartialProtectedMiddleware implements IMiddleware {
  constructor (private readonly httpHelper: IHttpHelper, private readonly verifyAccessToken: IVerifyToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = getToken.accessToken(httpRequest)

    const response = await this.verifyAccessToken.verify(accessToken)
    if (response instanceof Error) return this.httpHelper.unauthorized(response)

    const result = this.httpHelper.ok({ accessToken })

    return result
  }
}
