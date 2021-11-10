import { IController } from '@/presentation/controllers/protocols/controller.model'
import { CreateTaskController } from '@/presentation/controllers/task'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeTaskRepository } from '@/main/factories/repositories'
import { makeCreateTaskValidator } from '@/main/factories/validators/task'

export const makeCreateTaskController = (): IController => {
  const createTaskValidator = makeCreateTaskValidator()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const createTaskController = new CreateTaskController(createTaskValidator, httpHelper, taskRepository)

  return makeTryCatchDecorator(createTaskController)
}
