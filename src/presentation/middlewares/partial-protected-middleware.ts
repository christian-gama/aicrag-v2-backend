import { IVerifyToken } from '@/domain/providers'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IMiddleware } from './protocols/middleware-protocol'

export class PartialProtectedMiddleware implements IMiddleware {
  constructor (private readonly httpHelper: HttpHelperProtocol, private readonly verifyAccessToken: IVerifyToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.cookies?.accessToken

    const response = await this.verifyAccessToken.verify(accessToken)

    if (response instanceof Error) return this.httpHelper.unauthorized(response)

    return this.httpHelper.ok({ accessToken })
  }
}
