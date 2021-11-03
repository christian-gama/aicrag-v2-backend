import { ValidateUniqueTaskId } from '@/application/validators/task'
import { makeTaskRepository } from '@/main/factories/repositories/task-repository-factory'

export const makeValidateUniqueTaskId = (): ValidateUniqueTaskId => {
  const taskRepository = makeTaskRepository()

  return new ValidateUniqueTaskId(taskRepository)
}
