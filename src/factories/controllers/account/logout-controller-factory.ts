import { LogoutController } from '@/presentation/controllers/account'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeUserRepository } from '../../repositories'

export const makeLogoutController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()

  const logoutController = new LogoutController(httpHelper, userRepository)

  return makeTryCatchDecorator(logoutController)
}
