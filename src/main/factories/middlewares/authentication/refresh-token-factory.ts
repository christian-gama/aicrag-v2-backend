import { RefreshToken } from '@/presentation/middlewares/authentication/refresh-token'
import { makeJwtAccessToken } from '../../cryptography'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyRefreshToken } from '../../providers/token'

export const makeRefreshToken = (): RefreshToken => {
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const verifyRefreshToken = makeVerifyRefreshToken()

  return new RefreshToken(httpHelper, jwtAccessToken, verifyRefreshToken)
}
