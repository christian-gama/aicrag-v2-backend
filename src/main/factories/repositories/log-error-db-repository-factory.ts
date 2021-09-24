import { LogErrorDbRepository } from '@/infra/database/mongodb/repositories'

import { makeLogErrorRepository } from '.'

export const makeLogErrorDbRepository = (): LogErrorDbRepository => {
  const logErrorRepository = makeLogErrorRepository()

  return new LogErrorDbRepository(logErrorRepository)
}
