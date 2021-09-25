import { MustLogoutError } from '@/application/usecases/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '../helpers/http/protocols'
import { MiddlewareProtocol } from './protocols/middleware-protocol'

export class MustLogoutMiddleware implements MiddlewareProtocol {
  constructor (private readonly httpHelper: HttpHelperProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    return this.httpHelper.ok({})
  }
}
