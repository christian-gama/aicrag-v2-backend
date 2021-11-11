import { IController } from '@/presentation/controllers/protocols/controller.model'
import { DeleteTaskController } from '@/presentation/controllers/task'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeTaskRepository } from '@/main/factories/repositories'
import { makeValidateUUID } from '../../validators/common'

export const makeDeleteTaskController = (): IController => {
  const validateUUID = makeValidateUUID()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const deleteTaskController = new DeleteTaskController(validateUUID, httpHelper, taskRepository)

  return makeTryCatchDecorator(deleteTaskController)
}
