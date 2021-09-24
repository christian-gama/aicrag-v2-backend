import { ClearUserDatabase } from '@/main/scheduler/clear-user-database'

import { makeLogErrorDbRepository } from '../repositories'

export const makeClearUserDatabase = (): ClearUserDatabase => {
  const logErrorDbRepository = makeLogErrorDbRepository()

  return new ClearUserDatabase(logErrorDbRepository)
}
