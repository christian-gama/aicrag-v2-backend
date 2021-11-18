import { DeleteUserController } from '@/presentation/controllers/dashboard/users'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeUserRepository } from '@/main/factories/repositories'
import { makeDeleteUserValidator } from '@/main/factories/validators/user'

export const makeDeleteUserController = (): IController => {
  const deleteUserValidator = makeDeleteUserValidator()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()

  const deleteUserController = new DeleteUserController(deleteUserValidator, httpHelper, userRepository)

  return makeTryCatchDecorator(deleteUserController)
}
