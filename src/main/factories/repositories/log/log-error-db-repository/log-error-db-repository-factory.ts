import { LogErrorDbRepository } from '@/infra/database/mongodb/log/log-error-db-repository'
import { makeLogErrorRepository } from '../log-error-repository/log-error-repository-factory'

export const makeLogErrorDbRepository = (): LogErrorDbRepository => {
  const logErrorRepository = makeLogErrorRepository()

  return new LogErrorDbRepository(logErrorRepository)
}
