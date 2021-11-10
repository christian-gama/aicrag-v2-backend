import { LogoutController } from '@/presentation/controllers/account'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeUserRepository } from '../../repositories'

export const makeLogoutController = (): IController => {
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()

  const logoutController = new LogoutController(httpHelper, userRepository)

  return makeTryCatchDecorator(logoutController)
}
