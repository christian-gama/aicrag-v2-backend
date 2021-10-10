import { CreateTaskRepository } from '@/application/repositories'

import { makeUuid } from '../helpers'

export const makeCreateTaskRepository = (): CreateTaskRepository => {
  const uuid = makeUuid()

  return new CreateTaskRepository(uuid)
}
