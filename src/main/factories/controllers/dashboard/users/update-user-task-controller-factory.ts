import { UpdateUserTaskController } from '@/presentation/controllers/dashboard/users'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeTaskRepository, makeUserRepository } from '@/main/factories/repositories'
import { makeValidateUUID } from '@/main/factories/validators/common'
import {
  makeValidateCommentary,
  makeValidateDate,
  makeValidateDuration,
  makeValidateStatus,
  makeValidateTaskId,
  makeValidateType,
  makeValidateUniqueTaskId
} from '@/main/factories/validators/task'

export const makeUpdateUserTaskController = (): IController => {
  const httpHelper = makeHttpHelper()
  const taskRepository = makeTaskRepository()
  const userRepository = makeUserRepository()
  const validateCommentary = makeValidateCommentary()
  const validateDate = makeValidateDate()
  const validateDuration = makeValidateDuration()
  const validateStatus = makeValidateStatus()
  const validateTaskId = makeValidateTaskId()
  const validateUUID = makeValidateUUID()
  const validateType = makeValidateType()
  const validateUniqueTaskId = makeValidateUniqueTaskId()

  const updateUserTaskController = new UpdateUserTaskController(
    httpHelper,
    taskRepository,
    userRepository,
    validateCommentary,
    validateDate,
    validateDuration,
    validateStatus,
    validateTaskId,
    validateUUID,
    validateType,
    validateUniqueTaskId
  )

  return makeTryCatchDecorator(updateUserTaskController)
}
