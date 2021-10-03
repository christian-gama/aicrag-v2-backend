import { TaskRepository } from '@/application/repositories'

import { makeUuid } from '../helpers'

export const makeTaskRepository = (): TaskRepository => {
  const uuid = makeUuid()

  return new TaskRepository(uuid)
}
