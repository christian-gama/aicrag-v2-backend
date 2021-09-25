import { ProtectedMiddleware } from '@/presentation/middlewares'

import { makeJwtAccessToken } from '../../cryptography'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyAccessToken, makeVerifyRefreshToken } from '../../providers/token'

export const makeProtectedMiddleware = (): ProtectedMiddleware => {
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const verifyAccessToken = makeVerifyAccessToken()
  const verifyRefreshToken = makeVerifyRefreshToken()

  return new ProtectedMiddleware(httpHelper, jwtAccessToken, verifyAccessToken, verifyRefreshToken)
}
