/**
 * @description A generic http request that contains an optional body.
 */

export interface HttpRequest {
  /**
   * @description Body that comes from request.
   */
  body?: any
}

export interface HttpRequestToken {
  /**
   * @description Token that comes from request.
   */
  refreshToken?: string
  accessToken?: string
}
