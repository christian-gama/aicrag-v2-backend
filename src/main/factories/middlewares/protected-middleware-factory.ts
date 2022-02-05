import { ProtectedMiddleware } from '@/presentation/middlewares'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware.model'
import { makeTryCatchDecorator } from '../decorators'
import { makeHttpHelper } from '../helpers'
import { makeGenerateAccessToken, makeVerifyAccessToken, makeVerifyRefreshToken } from '../providers/token'

export const makeProtectedMiddleware = (): IMiddleware => {
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const verifyAccessToken = makeVerifyAccessToken()
  const verifyRefreshToken = makeVerifyRefreshToken()

  const protectedMiddleware = new ProtectedMiddleware(
    generateAccessToken,
    httpHelper,
    verifyAccessToken,
    verifyRefreshToken
  )

  return makeTryCatchDecorator(protectedMiddleware)
}
