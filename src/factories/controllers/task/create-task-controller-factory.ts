import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { CreateTaskController } from '@/presentation/controllers/task'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeTaskDbRepository } from '@/factories/repositories'
import { makeCreateTaskValidatorComposite } from '@/factories/validators/task'

export const makeCreateTaskController = (): ControllerProtocol => {
  const createTaskValidator = makeCreateTaskValidatorComposite()
  const httpHelper = makeHttpHelper()
  const taskDbRepository = makeTaskDbRepository()

  const createTaskController = new CreateTaskController(
    createTaskValidator,
    httpHelper,
    taskDbRepository
  )

  return makeTryCatchDecorator(createTaskController)
}
