import { LogErrorRepository } from '@/application/usecases/repositories/log-error-repository'

interface SutTypes {
  sut: LogErrorRepository
}

export const makeSut = (): SutTypes => {
  const sut = new LogErrorRepository()

  return { sut }
}
