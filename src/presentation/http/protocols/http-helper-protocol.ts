import { HttpResponse } from './http-response-protocol'

export interface IHttpHelper
  extends IHttpBadRequest,
  IHttpUnauthorized,
  IHttpForbidden,
  IHttpNotFound,
  IHttpConflict,
  IHttpOk,
  IHttpCreated,
  IHttpDeleted,
  IHttpServerError {}

// ****************
// Range: 400 ~ 409
export interface IHttpBadRequest {
  /**
   * @description A helper method used when status code is 400.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  badRequest: (error: Error) => HttpResponse
}

export interface IHttpUnauthorized {
  /**
   * @description A helper method used when status code is 401.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  unauthorized: (error: Error) => HttpResponse
}

export interface IHttpForbidden {
  /**
   * @description A helper method used when status code is 403.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  forbidden: (error: Error) => HttpResponse
}

export interface IHttpNotFound {
  /**
   * @description A helper method used when status code is 404.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  notFound: (error: Error) => HttpResponse
}

export interface IHttpConflict {
  /**
   * @description A helper method used when status code is 409.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  conflict: (error: Error) => HttpResponse
}

// ****************
// Range: 200 ~ 204
export interface IHttpOk {
  /**
   * @description A helper method used when status code is 200.
   * @param data Any data that will be used on the http response.
   * @param accessToken Optional. Token that will be used as authentication.
   * @returns Return a generic http response.
   */
  ok: (data: { [key: string]: any, accessToken?: string }) => HttpResponse
}

export interface IHttpCreated {
  /**
   * @description A helper method used when status code is 201.
   * @param data Any data that will be used on the http response.
   * @returns Return a generic http response.
   */
  created: (data: any) => HttpResponse
}

export interface IHttpDeleted {
  /**
   * @description A helper method used when status code is 204.
   * @param data Any data that will be used on the http response.
   * @returns Return a generic http response.
   */
  deleted: () => HttpResponse
}

// ****************
// Range: 500
export interface IHttpServerError {
  /**
   * @description A helper method used when status code is 500.
   * @param error Any error that extends Error.
   * @returns Return a generic http response.
   */
  serverError: (error: Error) => HttpResponse
}
