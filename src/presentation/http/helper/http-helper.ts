import {
  HttpBadRequestProtocol,
  HttpUnauthorizedProtocol,
  HttpForbiddenProtocol,
  HttpNotFoundProtocol,
  HttpConflictProtocol,
  HttpOkProtocol,
  HttpCreatedProtocol,
  HttpDeletedProtocol,
  HttpServerErrorProtocol,
  HttpResponse
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
  // ****************
  // Range: 400 ~ 409
  badRequest (error: Error): HttpResponse {
    return {
      status: 'fail',
      statusCode: 400,
      data: { message: error.message }
    }
  }

  unauthorized (error: Error): HttpResponse {
    return {
      status: 'fail',
      statusCode: 401,
      data: { message: error.message }
    }
  }

  forbidden (error: Error): HttpResponse {
    return {
      status: 'fail',
      statusCode: 403,
      data: { message: error.message }
    }
  }

  notFound (error: Error): HttpResponse {
    return {
      status: 'fail',
      statusCode: 404,
      data: { message: error.message }
    }
  }

  conflict (error: Error): HttpResponse {
    return {
      status: 'fail',
      statusCode: 409,
      data: { message: error.message }
    }
  }

  // ****************
  // Range: 200 ~ 204
  ok (data: any, accessToken?: string): HttpResponse {
    if (accessToken) return { status: 'success', statusCode: 200, data, accessToken }

    return { status: 'success', statusCode: 200, data }
  }

  created (data: any): HttpResponse {
    return { status: 'success', statusCode: 201, data }
  }

  deleted (): HttpResponse {
    return { status: 'success', statusCode: 204, data: { message: 'Content deleted' } }
  }

  // ****************
  // Range: 500
  serverError (error: Error): HttpResponse {
    return {
      status: 'fail',
      statusCode: 500,
      data: { message: error.message }
    }
  }
}
