import { HttpRequestToken, HttpResponse } from '@/presentation/helpers/http/protocols'

export interface MiddlewareProtocol {
  handle: (httpRequest: HttpRequestToken) => Promise<HttpResponse>
}
