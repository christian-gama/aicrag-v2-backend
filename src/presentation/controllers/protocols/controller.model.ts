import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'

export interface IController {
  /**
   * @async Asynchronous method.
   * @description Generic controller that receive a generic http request.
   * @param httpRequest A generic http request.
   * @returns Return a generic http response.
   */
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
