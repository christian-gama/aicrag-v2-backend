import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { FindOneTaskController } from '@/presentation/controllers/task'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeTaskDbRepository } from '@/factories/repositories'
import { makeValidateTaskParam } from '@/factories/validators/task'

export const makeFindOneTaskController = (): ControllerProtocol => {
  const validateTaskParam = makeValidateTaskParam()
  const httpHelper = makeHttpHelper()
  const taskDbRepository = makeTaskDbRepository()

  const findOneTaskController = new FindOneTaskController(
    validateTaskParam,
    httpHelper,
    taskDbRepository
  )

  return makeTryCatchDecorator(findOneTaskController)
}
