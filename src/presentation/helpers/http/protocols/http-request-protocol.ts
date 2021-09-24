import { IUser } from '@/domain'

/**
 * @description A generic http request that contains an optional body and user.
 */
export interface HttpRequest {
  /**
   * @description Data that comes from request.
   */
  query?: any
  params?: any
  body?: any
  user?: IUser
  refreshToken?: string
  accessToken?: string
}
