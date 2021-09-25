import { PartialProtectedMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '../../helpers'
import { makeVerifyAccessToken } from '../../providers/token'

export const makePartialProtectedMiddleware = (): PartialProtectedMiddleware => {
  const httpHelper = makeHttpHelper()
  const verifyAccessToken = makeVerifyAccessToken()

  return new PartialProtectedMiddleware(httpHelper, verifyAccessToken)
}
