import { IController } from '@/presentation/controllers/protocols/controller.model'
import { FindAllTasksController } from '@/presentation/controllers/task'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeTaskRepository } from '@/main/factories/repositories'
import { makeQueryValidator } from '@/main/factories/validators/query'

export const makeFindAllTasksController = (): IController => {
  const queryValidator = makeQueryValidator()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const findAllTasksController = new FindAllTasksController(httpHelper, queryValidator, taskRepository)

  return makeTryCatchDecorator(findAllTasksController)
}
