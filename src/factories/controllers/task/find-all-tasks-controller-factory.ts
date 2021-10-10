import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { FindAllTasksController } from '@/presentation/controllers/task'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeTaskRepository } from '@/factories/repositories'
import { makeQueryValidatorComposite } from '@/factories/validators/query'

export const makeFindAllTasksController = (): ControllerProtocol => {
  const queryValidator = makeQueryValidatorComposite()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const findAllTasksController = new FindAllTasksController(
    httpHelper,
    queryValidator,
    taskRepository
  )

  return makeTryCatchDecorator(findAllTasksController)
}
