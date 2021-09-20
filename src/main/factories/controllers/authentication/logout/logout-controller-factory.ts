import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { LogoutController } from '@/presentation/controllers/authentication/logout/logout-controller'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'

export const makeLogoutController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()

  const logoutController = new LogoutController(
    httpHelper,
    userDbRepository
  )

  return makeTryCatchControllerDecorator(logoutController)
}
