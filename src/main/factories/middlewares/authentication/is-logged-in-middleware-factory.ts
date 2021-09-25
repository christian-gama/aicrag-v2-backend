import { IsLoggedInMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '../../helpers'
import { makeVerifyRefreshToken } from '../../providers/token'

export const makeIsLoggedInMiddleware = (): IsLoggedInMiddleware => {
  const httpHelper = makeHttpHelper()
  const verifyRefreshToken = makeVerifyRefreshToken()

  return new IsLoggedInMiddleware(httpHelper, verifyRefreshToken)
}
