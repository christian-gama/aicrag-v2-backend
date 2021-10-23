import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { UpdateTaskController } from '@/presentation/controllers/task'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeTaskRepository } from '@/factories/repositories'
import {
  makeValidateCommentary,
  makeValidateDate,
  makeValidateDuration,
  makeValidateStatus,
  makeValidateTaskId,
  makeValidateTaskParam,
  makeValidateType
} from '@/factories/validators/task'

export const makeUpdateTaskController = (): IController => {
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()
  const validateCommentary = makeValidateCommentary()
  const validateDate = makeValidateDate()
  const validateDuration = makeValidateDuration()
  const validateStatus = makeValidateStatus()
  const validateTaskId = makeValidateTaskId()
  const validateTaskParam = makeValidateTaskParam()
  const validateType = makeValidateType()

  const updateTaskController = new UpdateTaskController(
    httpHelper,
    taskRepository,
    validateCommentary,
    validateDate,
    validateDuration,
    validateStatus,
    validateTaskId,
    validateTaskParam,
    validateType
  )

  return makeTryCatchDecorator(updateTaskController)
}
