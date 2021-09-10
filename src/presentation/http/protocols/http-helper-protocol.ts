import { HttpResponse } from './http-response-protocol'

export interface HttpHelperProtocol
  extends HttpBadRequestProtocol,
  HttpUnauthorizedProtocol,
  HttpForbiddenProtocol,
  HttpNotFoundProtocol,
  HttpConflictProtocol,
  HttpOkProtocol,
  HttpCreatedProtocol,
  HttpDeletedProtocol {}
export interface HttpBadRequestProtocol {
  badRequest: (error: Error) => HttpResponse
}

export interface HttpUnauthorizedProtocol {
  unauthorized: (error: Error) => HttpResponse
}

export interface HttpForbiddenProtocol {
  forbidden: (error: Error) => HttpResponse
}

export interface HttpNotFoundProtocol {
  notFound: (error: Error) => HttpResponse
}

export interface HttpConflictProtocol {
  conflict: (error: Error) => HttpResponse
}

export interface HttpOkProtocol {
  ok: (data: any, accessToken?: string) => HttpResponse
}

export interface HttpCreatedProtocol {
  created: (data: any) => HttpResponse
}

export interface HttpDeletedProtocol {
  deleted: () => HttpResponse
}
