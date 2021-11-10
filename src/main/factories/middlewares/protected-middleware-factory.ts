import { ProtectedMiddleware } from '@/presentation/middlewares'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware.model'
import { makeAccessTokenEncrypter } from '../cryptography'
import { makeTryCatchDecorator } from '../decorators'
import { makeHttpHelper } from '../helpers'
import { makeVerifyAccessToken, makeVerifyRefreshToken } from '../providers/token'

export const makeProtectedMiddleware = (): IMiddleware => {
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
