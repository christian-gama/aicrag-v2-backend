import { User } from '@/domain/user'

/**
 * @description A generic http request that contains an optional body and user.
 */
export interface HttpRequest {
  /**
   * @description Body that comes from request.
   */
  body?: any
  user?: User
}

export interface HttpRequestToken {
  /**
   * @description Token that comes from request.
   */
  refreshToken?: string
  accessToken?: string
}
