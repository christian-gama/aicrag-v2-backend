import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'

export interface IMiddleware {
  /**
   * @async Asynchronous method.
   * @description Generic middleware that receive a generic http request.
   * @param httpRequest A generic http request that contains a token.
   * @returns Return a generic http response.
   */

  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
