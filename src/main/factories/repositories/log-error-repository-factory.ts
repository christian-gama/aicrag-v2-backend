import { LogErrorRepository } from '@/application/usecases/repositories/log-error-repository'

export const makeLogErrorRepository = (): LogErrorRepository => {
  return new LogErrorRepository()
}
