import { HttpResponse } from './http-response-protocol'

export interface HttpHelperProtocol {
  badRequest: (error: Error) => HttpResponse
}
