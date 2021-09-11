import { LogErrorRepository } from '@/application/usecases/repositories/log/log-error-repository'

export const makeLogErrorRepository = (): LogErrorRepository => {
  return new LogErrorRepository()
}
