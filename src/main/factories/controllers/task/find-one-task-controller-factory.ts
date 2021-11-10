import { IController } from '@/presentation/controllers/protocols/controller.model'
import { FindOneTaskController } from '@/presentation/controllers/task'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeTaskRepository } from '@/main/factories/repositories'
import { makeValidateTaskParam } from '@/main/factories/validators/task'

export const makeFindOneTaskController = (): IController => {
  const validateTaskParam = makeValidateTaskParam()
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()

  const findOneTaskController = new FindOneTaskController(validateTaskParam, httpHelper, taskRepository)

  return makeTryCatchDecorator(findOneTaskController)
}
