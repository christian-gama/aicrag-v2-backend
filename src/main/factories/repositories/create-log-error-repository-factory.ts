import { CreateLogErrorRepository } from '@/application/repositories/create-log-error-repository'

export const makeCreateLogErrorRepository = (): CreateLogErrorRepository => {
  return new CreateLogErrorRepository()
}
