import { LogErrorRepository } from '@/application/usecases/repositories/log/log-error-repository'

export const makeSut = (): LogErrorRepository => {
  const sut = new LogErrorRepository()

  return sut
}
