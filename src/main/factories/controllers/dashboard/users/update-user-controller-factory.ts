import { UpdateUserController } from '@/presentation/controllers/dashboard/users'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeUserRepository } from '@/main/factories/repositories'
import { makeUpdateUserValidator } from '@/main/factories/validators/user'

export const makeUpdateUserController = (): IController => {
  const httpHelper = makeHttpHelper()
  const updateUserValidator = makeUpdateUserValidator()
  const userRepository = makeUserRepository()
  const updateUserController = new UpdateUserController(httpHelper, updateUserValidator, userRepository)

  return makeTryCatchDecorator(updateUserController)
}
