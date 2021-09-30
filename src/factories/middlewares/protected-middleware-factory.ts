import { ProtectedMiddleware } from '@/presentation/middlewares'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeAccessTokenEncrypter } from '../cryptography'
import { makeTryCatchDecorator } from '../decorators'
import { makeHttpHelper } from '../helpers'
import { makeVerifyAccessToken, makeVerifyRefreshToken } from '../providers/token'

export const makeProtectedMiddleware = (): MiddlewareProtocol => {
  const httpHelper = makeHttpHelper()
  const accessTokenEncrypter = makeAccessTokenEncrypter()
  const verifyAccessToken = makeVerifyAccessToken()
  const verifyRefreshToken = makeVerifyRefreshToken()

  const protectedMiddleware = new ProtectedMiddleware(
    httpHelper,
    accessTokenEncrypter,
    verifyAccessToken,
    verifyRefreshToken
  )

  return makeTryCatchDecorator(protectedMiddleware)
}
