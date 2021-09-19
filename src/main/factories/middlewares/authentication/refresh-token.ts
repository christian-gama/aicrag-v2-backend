import { RefreshToken } from '@/presentation/middlewares/authentication/refresh-token'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAccessToken } from '@/main/factories/cryptography/jwt-access-token-factory'
import { makeVerifyRefreshToken } from '../../providers/token/verify-refresh-token-factory'

export const makeRefreshToken = (): RefreshToken => {
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const verifyRefreshToken = makeVerifyRefreshToken()

  return new RefreshToken(httpHelper, jwtAccessToken, verifyRefreshToken)
}
