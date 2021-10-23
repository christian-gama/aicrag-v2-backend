import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { FindOneTaskController } from '@/presentation/controllers/task'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeTaskRepository } from '@/factories/repositories'
import { makeValidateTaskParam } from '@/factories/validators/task'

export const makeFindOneTaskController = (): IController => {
  const validateTaskParam = makeValidateTaskParam()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const findOneTaskController = new FindOneTaskController(validateTaskParam, httpHelper, taskRepository)

  return makeTryCatchDecorator(findOneTaskController)
}
