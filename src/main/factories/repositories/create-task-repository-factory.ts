import { CreateTaskRepository } from '@/application/repositories'
import { makeDateUtils, makeUuid } from '../helpers'

export const makeCreateTaskRepository = (): CreateTaskRepository => {
  const dateUtils = makeDateUtils()
  const uuid = makeUuid()

  return new CreateTaskRepository(dateUtils, uuid)
}
