import { ClearUserDatabase } from '@/main/scheduler/clear-user-database'
import { makeLogErrorDbRepository } from '../repositories/log/log-error-db-repository/log-error-db-repository-factory'

export const makeClearUserDatabase = (): ClearUserDatabase => {
  const logErrorDbRepository = makeLogErrorDbRepository()

  return new ClearUserDatabase(logErrorDbRepository)
}
