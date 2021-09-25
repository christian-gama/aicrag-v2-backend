import { RefreshTokenMiddleware } from '@/presentation/middlewares'

import { makeJwtAccessToken } from '../../cryptography'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyRefreshToken } from '../../providers/token'

export const makeRefreshTokenMiddleware = (): RefreshTokenMiddleware => {
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const verifyRefreshToken = makeVerifyRefreshToken()

  return new RefreshTokenMiddleware(httpHelper, jwtAccessToken, verifyRefreshToken)
}
