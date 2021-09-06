import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'

export interface ControllerProtocol {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
