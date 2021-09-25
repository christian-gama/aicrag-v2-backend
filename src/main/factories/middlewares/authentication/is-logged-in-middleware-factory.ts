import { IsLoggedInMiddleware } from '@/presentation/middlewares'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyRefreshToken } from '../../providers/token'

export const makeIsLoggedInMiddleware = (): MiddlewareProtocol => {
  const httpHelper = makeHttpHelper()
  const verifyRefreshToken = makeVerifyRefreshToken()

  const isLoggedInMiddleware = new IsLoggedInMiddleware(httpHelper, verifyRefreshToken)

  return makeTryCatchDecorator(isLoggedInMiddleware)
}
