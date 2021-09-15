import { HttpResponse } from './http-response-protocol'

export interface HttpHelperProtocol
  extends HttpBadRequestProtocol,
  HttpUnauthorizedProtocol,
  HttpForbiddenProtocol,
  HttpNotFoundProtocol,
  HttpConflictProtocol,
  HttpOkProtocol,
  HttpCreatedProtocol,
  HttpDeletedProtocol,
  HttpServerErrorProtocol {}

// ****************
// Range: 400 ~ 409
export interface HttpBadRequestProtocol {
  /**
   * @description A helper method used when status code is 400.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  badRequest: (error: Error) => HttpResponse
}

export interface HttpUnauthorizedProtocol {
  /**
   * @description A helper method used when status code is 401.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  unauthorized: (error: Error) => HttpResponse
}

export interface HttpForbiddenProtocol {
  /**
   * @description A helper method used when status code is 403.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  forbidden: (error: Error) => HttpResponse
}

export interface HttpNotFoundProtocol {
  /**
   * @description A helper method used when status code is 404.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  notFound: (error: Error) => HttpResponse
}

export interface HttpConflictProtocol {
  /**
   * @description A helper method used when status code is 409.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  conflict: (error: Error) => HttpResponse
}

// ****************
// Range: 200 ~ 204
export interface HttpOkProtocol {
  /**
   * @description A helper method used when status code is 200.
   * @param data Any data that will be used on the http response.
   * @param accessToken Optional. Token that will be used as authentication.
   * @returns Return a generic http response.
   */
  ok: (data: { [key: string]: any, accessToken?: string }) => HttpResponse
}

export interface HttpCreatedProtocol {
  /**
   * @description A helper method used when status code is 201.
   * @param data Any data that will be used on the http response.
   * @returns Return a generic http response.
   */
  created: (data: any) => HttpResponse
}

export interface HttpDeletedProtocol {
  /**
   * @description A helper method used when status code is 204.
   * @param data Any data that will be used on the http response.
   * @returns Return a generic http response.
   */
  deleted: () => HttpResponse
}

// ****************
// Range: 500
export interface HttpServerErrorProtocol {
  /**
   * @description A helper method used when status code is 500.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  serverError: (error: Error) => HttpResponse
}
