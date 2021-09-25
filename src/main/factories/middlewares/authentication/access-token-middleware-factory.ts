import { AccessTokenMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '../../helpers'
import { makeVerifyAccessToken } from '../../providers/token'

export const makeAccessTokenMiddleware = (): AccessTokenMiddleware => {
  const httpHelper = makeHttpHelper()
  const verifyAccessToken = makeVerifyAccessToken()

  return new AccessTokenMiddleware(httpHelper, verifyAccessToken)
}
