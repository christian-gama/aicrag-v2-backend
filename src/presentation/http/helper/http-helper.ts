import {
  HttpBadRequestProtocol,
  HttpConflictProtocol,
  HttpCreatedProtocol,
  HttpDeletedProtocol,
  HttpForbiddenProtocol,
  HttpNotFoundProtocol,
  HttpOkProtocol,
  HttpResponse,
  HttpUnauthorizedProtocol,
  HttpServerErrorProtocol
} from '../protocols'

export class HttpHelper
implements
    HttpBadRequestProtocol,
    HttpUnauthorizedProtocol,
    HttpForbiddenProtocol,
    HttpNotFoundProtocol,
    HttpConflictProtocol,
    HttpOkProtocol,
    HttpCreatedProtocol,
    HttpDeletedProtocol,
    HttpServerErrorProtocol {
  badRequest (error: Error): HttpResponse {
    return {
      statusCode: 400,
      data: { message: error.message }
    }
  }

  unauthorized (error: Error): HttpResponse {
    return {
      statusCode: 401,
      data: { message: error.message }
    }
  }

  forbidden (error: Error): HttpResponse {
    return {
      statusCode: 403,
      data: { message: error.message }
    }
  }

  notFound (error: Error): HttpResponse {
    return {
      statusCode: 404,
      data: { message: error.message }
    }
  }

  conflict (error: Error): HttpResponse {
    return {
      statusCode: 409,
      data: { message: error.message }
    }
  }

  ok (data: any, accessToken?: string): HttpResponse {
    if (accessToken) return { statusCode: 200, data, accessToken }

    return { statusCode: 200, data }
  }

  created (data: any): HttpResponse {
    return { statusCode: 201, data }
  }

  deleted (): HttpResponse {
    return { statusCode: 204, data: { message: 'Content deleted' } }
  }

  serverError (error: Error): HttpResponse {
    return {
      statusCode: 500,
      data: { message: error.message }
    }
  }
}
