import { LogErrorRepository } from '@/application/repositories/log-error-repository'

export const makeLogErrorRepository = (): LogErrorRepository => {
  return new LogErrorRepository()
}
