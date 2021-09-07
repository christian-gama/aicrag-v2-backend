import { HttpHelperProtocol, HttpResponse } from '../protocols'

export class HttpHelper implements HttpHelperProtocol {
  badRequest (error: Error): HttpResponse {
    return {
      statusCode: 400,
      data: { message: error.message }
    }
  }
}
