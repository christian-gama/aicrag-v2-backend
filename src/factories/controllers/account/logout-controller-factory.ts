import { LogoutController } from '@/presentation/controllers/account'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeUserDbRepository } from '../../repositories'

export const makeLogoutController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()

  const logoutController = new LogoutController(httpHelper, userDbRepository)

  return makeTryCatchDecorator(logoutController)
}
