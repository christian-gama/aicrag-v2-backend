import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { DeleteTaskController } from '@/presentation/controllers/task'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeTaskRepository } from '@/main/factories/repositories'
import { makeValidateTaskParam } from '@/main/factories/validators/task'

export const makeDeleteTaskController = (): IController => {
  const validateTaskParam = makeValidateTaskParam()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const deleteTaskController = new DeleteTaskController(validateTaskParam, httpHelper, taskRepository)

  return makeTryCatchDecorator(deleteTaskController)
}
