import { ValidateUniqueTaskId } from '@/application/validators/task'

import { makeTaskDbRepository } from '@/factories/repositories/task-db-repository-factory'

export const makeValidateUniqueTaskId = (): ValidateUniqueTaskId => {
  const taskDbRepository = makeTaskDbRepository()

  return new ValidateUniqueTaskId(taskDbRepository)
}
