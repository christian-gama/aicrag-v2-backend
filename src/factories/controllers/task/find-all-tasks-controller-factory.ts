import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { FindAllTasksController } from '@/presentation/controllers/task'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeTaskRepository } from '@/factories/repositories'
import { makeQueryValidator } from '@/factories/validators/query'

export const makeFindAllTasksController = (): IController => {
  const queryValidator = makeQueryValidator()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const findAllTasksController = new FindAllTasksController(httpHelper, queryValidator, taskRepository)

  return makeTryCatchDecorator(findAllTasksController)
}
