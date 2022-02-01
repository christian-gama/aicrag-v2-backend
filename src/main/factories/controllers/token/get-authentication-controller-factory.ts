import { IController } from '@/presentation/controllers/protocols/controller.model'
import { GetAuthenticationController } from '@/presentation/controllers/token'
import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyAccessToken, makeVerifyRefreshToken } from '../../providers/token'

export const makeGetAuthenticationController = (): IController => {
  const httpHelper = makeHttpHelper()
  const verifyAccessToken = makeVerifyAccessToken()
  const verifyRefreshToken = makeVerifyRefreshToken()

  const getAuthenticationController = new GetAuthenticationController(httpHelper, verifyAccessToken, verifyRefreshToken)

  return makeTryCatchDecorator(getAuthenticationController)
}
