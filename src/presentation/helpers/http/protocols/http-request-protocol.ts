import { IUser } from '@/domain'

/**
 * @description A generic http request that contains an optional body and user.
 */
export interface HttpRequest {
  /**
   * @description Body that comes from request.
   */
  body?: any
  user?: IUser
}

export interface HttpRequestToken {
  /**
   * @description Token that comes from request.
   */
  refreshToken?: string
  accessToken?: string
}
