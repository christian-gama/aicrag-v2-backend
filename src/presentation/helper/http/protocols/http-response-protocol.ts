/**
 * @description A generic http request that contains an optional body.
 */
export interface HttpResponse {
  /**
   * @description The HTTP status code.
   */
  statusCode: number
  /**
   * @description The current status from the response.
   */
  status: 'fail' | 'success'
  /**
   * @description Any data that will be sent on the response.
   */
  data: any
  /**
   * @description Optional. Access token that authorize a user.
   */
  accessToken?: string
}
