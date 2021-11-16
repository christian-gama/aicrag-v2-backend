import { FindAllUsersController } from '@/presentation/controllers/dashboard/users'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeUserRepository } from '@/main/factories/repositories'
import { makeFindAllUsersValidator } from '@/main/factories/validators/query/find-all-users-validator-factory'

export const makeFindAllUsersController = (): IController => {
  const findAllUsersValidator = makeFindAllUsersValidator()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()
  const findAllUsersController = new FindAllUsersController(findAllUsersValidator, httpHelper, userRepository)

  return makeTryCatchDecorator(findAllUsersController)
}
