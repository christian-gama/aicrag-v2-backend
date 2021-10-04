import { IsLoggedInMiddleware } from '@/presentation/middlewares'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeTryCatchDecorator } from '../decorators'
import { makeHttpHelper } from '../helpers'
import { makeVerifyRefreshToken } from '../providers/token'
import { makeUserDbRepository } from '../repositories'

export const makeIsLoggedInMiddleware = (): MiddlewareProtocol => {
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()
  const verifyRefreshToken = makeVerifyRefreshToken()

  const isLoggedInMiddleware = new IsLoggedInMiddleware(httpHelper, userDbRepository, verifyRefreshToken)

  return makeTryCatchDecorator(isLoggedInMiddleware)
}
