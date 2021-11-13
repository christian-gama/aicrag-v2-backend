import { IController } from '@/presentation/controllers/protocols/controller.model'
import { UpdateTaskController } from '@/presentation/controllers/task'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeTaskRepository } from '@/main/factories/repositories'
import {
  makeValidateCommentary,
  makeValidateDate,
  makeValidateDuration,
  makeValidateStatus,
  makeValidateTaskId,
  makeValidateType,
  makeValidateUniqueTaskId
} from '@/main/factories/validators/task'
import { makeValidateUUID } from '../../validators/common'

export const makeUpdateTaskController = (): IController => {
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()
  const validateCommentary = makeValidateCommentary()
  const validateDate = makeValidateDate()
  const validateDuration = makeValidateDuration()
  const validateStatus = makeValidateStatus()
  const validateTaskId = makeValidateTaskId()
  const validateUUID = makeValidateUUID()
  const validateType = makeValidateType()
  const validateUniqueTaskId = makeValidateUniqueTaskId()

  const updateTaskController = new UpdateTaskController(
    httpHelper,
    taskRepository,
    validateCommentary,
    validateDate,
    validateDuration,
    validateStatus,
    validateTaskId,
    validateUUID,
    validateType,
    validateUniqueTaskId
  )

  return makeTryCatchDecorator(updateTaskController)
}
