import { IUser } from '@/domain'

/**
 * @description A generic http request that contains an optional body and user.
 */
export interface HttpRequest {
  /**
   * @description Data that comes from request.
   */
  body?: any
  cookies?: {
    accessToken?: string
    refreshToken?: string
  }
  params?: any
  query?: any
  user?: IUser

}
