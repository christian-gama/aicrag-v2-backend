import { HttpHelperProtocol, HttpResponse } from './protocols'

export class HttpHelper implements HttpHelperProtocol {
  // ****************
  // Range: 400 ~ 409
  badRequest (error: Error): HttpResponse {
    return {
      status: false,
      statusCode: 400,
      data: { message: error.message }
    }
  }

  unauthorized (error: Error): HttpResponse {
    return {
      status: false,
      statusCode: 401,
      data: { message: error.message }
    }
  }

  forbidden (error: Error): HttpResponse {
    return {
      status: false,
      statusCode: 403,
      data: { message: error.message }
    }
  }

  notFound (error: Error): HttpResponse {
    return {
      status: false,
      statusCode: 404,
      data: { message: error.message }
    }
  }

  conflict (error: Error): HttpResponse {
    return {
      status: false,
      statusCode: 409,
      data: { message: error.message }
    }
  }

  // ****************
  // Range: 200 ~ 204
  ok (data: { [key: string]: any }): HttpResponse {
    return { status: true, statusCode: 200, data }
  }

  created (data: any): HttpResponse {
    return { status: true, statusCode: 201, data }
  }

  deleted (): HttpResponse {
    return { status: true, statusCode: 204, data: { message: 'Content deleted' } }
  }

  // ****************
  // Range: 500
  serverError (error: Error): HttpResponse {
    return {
      status: false,
      statusCode: 500,
      data: { error: { name: error.name, message: error.message, stack: error.stack } }
    }
  }
}
