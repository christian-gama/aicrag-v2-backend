import { PartialProtectedMiddleware } from '@/presentation/middlewares'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeTryCatchDecorator } from '../decorators'
import { makeHttpHelper } from '../helpers'
import { makeVerifyAccessToken } from '../providers/token'

export const makePartialProtectedMiddleware = (): IMiddleware => {
  const httpHelper = makeHttpHelper()
  const verifyAccessToken = makeVerifyAccessToken()

  const partialProtectedMiddleware = new PartialProtectedMiddleware(httpHelper, verifyAccessToken)

  return makeTryCatchDecorator(partialProtectedMiddleware)
}
