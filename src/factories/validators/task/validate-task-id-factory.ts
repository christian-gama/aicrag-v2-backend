import { ValidateTaskId } from '@/application/validators/task'

import { makeTaskRepository } from '@/factories/repositories'

export const makeValidateTaskId = (): ValidateTaskId => {
  const taskRepository = makeTaskRepository()

  return new ValidateTaskId(taskRepository)
}
