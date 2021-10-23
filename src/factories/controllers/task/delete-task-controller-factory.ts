import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { DeleteTaskController } from '@/presentation/controllers/task'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeTaskRepository } from '@/factories/repositories'
import { makeValidateTaskParam } from '@/factories/validators/task'

export const makeDeleteTaskController = (): IController => {
  const validateTaskParam = makeValidateTaskParam()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const deleteTaskController = new DeleteTaskController(validateTaskParam, httpHelper, taskRepository)

  return makeTryCatchDecorator(deleteTaskController)
}
