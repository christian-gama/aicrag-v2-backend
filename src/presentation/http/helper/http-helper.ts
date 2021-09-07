import { HttpHelperProtocol, HttpResponse } from '../protocols'

export class HttpHelper implements HttpHelperProtocol {
  badRequest (error: Error): HttpResponse {
    return {
      statusCode: 400,
      data: { message: error.message }
    }
  }

  notFound (error: Error): HttpResponse {
    return {
      statusCode: 404,
      data: { message: error.message }
    }
  }

  ok (data: any): HttpResponse {
    return { statusCode: 200, data }
  }
}
