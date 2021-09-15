import { HttpRequestToken, HttpResponse } from '@/presentation/helpers/http/protocols'

export interface MiddlewareProtocol {
  /**
   * @async Asynchronous method.
   * @description Generic middleware that receive a generic http request.
   * @param httpRequest A generic http request that contains a token.
   * @returns Return a generic http response.
   */

  handle: (httpRequest: HttpRequestToken) => Promise<HttpResponse>
}
