import {
  HttpBadRequestProtocol,
  HttpConflictProtocol,
  HttpCreatedProtocol,
  HttpDeletedProtocol,
  HttpForbiddenProtocol,
  HttpNotFoundProtocol,
  HttpOkProtocol,
  HttpResponse,
  HttpUnauthorizedProtocol
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
    HttpDeletedProtocol {
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

  ok (data: any): HttpResponse {
    return { statusCode: 200, data }
  }

  created (data: any): HttpResponse {
    return { statusCode: 201, data }
  }

  deleted (): HttpResponse {
    return { statusCode: 204, data: { message: 'Content deleted' } }
  }
}
