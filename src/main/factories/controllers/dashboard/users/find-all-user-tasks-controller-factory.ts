import { FindAllUserTasksController } from '@/presentation/controllers/dashboard/users'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeTaskRepository, makeUserRepository } from '@/main/factories/repositories'
import { makeQueryValidator } from '@/main/factories/validators/query'

export const makeFindAllUserTasksController = (): IController => {
  const queryValidator = makeQueryValidator()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()
  const userRepository = makeUserRepository()

  const findAllUserTasksController = new FindAllUserTasksController(
    httpHelper,
    queryValidator,
    taskRepository,
    userRepository
  )

  return makeTryCatchDecorator(findAllUserTasksController)
}
