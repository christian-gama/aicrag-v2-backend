import { ValidateTaskId } from '@/application/validators/task'
import { makeTaskRepository } from '@/main/factories/repositories'

export const makeValidateTaskId = (): ValidateTaskId => {
  const taskRepository = makeTaskRepository()

  return new ValidateTaskId(taskRepository)
}
