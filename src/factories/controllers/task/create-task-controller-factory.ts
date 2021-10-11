import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { CreateTaskController } from '@/presentation/controllers/task'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeTaskRepository } from '@/factories/repositories'
import { makeCreateTaskValidator } from '@/factories/validators/task'

export const makeCreateTaskController = (): ControllerProtocol => {
  const createTaskValidator = makeCreateTaskValidator()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const createTaskController = new CreateTaskController(
    createTaskValidator,
    httpHelper,
    taskRepository
  )

  return makeTryCatchDecorator(createTaskController)
}
