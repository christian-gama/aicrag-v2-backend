import { HttpHelperProtocol, HttpResponse } from './protocols'

export class HttpHelper implements HttpHelperProtocol {
  // ****************
  // Range: 200 ~ 204
  ok (data: { [key: string]: any }): HttpResponse {
    return { data, status: true, statusCode: 200 }
  }

  created (data: any): HttpResponse {
    return { data, status: true, statusCode: 201 }
  }

  deleted (): HttpResponse {
    return { data: { message: 'Content deleted' }, status: true, statusCode: 204 }
  }

  // ****************
  // Range: 400 ~ 409
  badRequest (error: Error): HttpResponse {
    const result = {
      data: { message: error.message },
      status: false,
      statusCode: 400
    }

    return result
  }

  unauthorized (error: Error): HttpResponse {
    const result = {
      data: { message: error.message },
      status: false,
      statusCode: 401
    }

    return result
  }

  forbidden (error: Error): HttpResponse {
    const result = {
      data: { message: error.message },
      status: false,
      statusCode: 403
    }

    return result
  }

  notFound (error: Error): HttpResponse {
    const result = {
      data: { message: error.message },
      status: false,
      statusCode: 404
    }

    return result
  }

  conflict (error: Error): HttpResponse {
    const result = {
      data: { message: error.message },
      status: false,
      statusCode: 409
    }

    return result
  }

  // ****************
  // Range: 500
  serverError (error: Error): HttpResponse {
    const result = {
      data: { error: { message: error.message, name: error.name, stack: error.stack } },
      status: false,
      statusCode: 500
    }

    return result
  }
}
