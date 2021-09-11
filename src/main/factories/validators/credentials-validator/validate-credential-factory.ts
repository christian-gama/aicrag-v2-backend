import { ValidateCredentials } from '@/application/usecases/validators/credentials/validate-credentials'
import { makeAccountDbRepository } from '@/main/factories/repositories/account-db-repository/account-db-repository-factory'
import { makeBcryptAdapter } from '@/main/factories/cryptography/hasher-factory'

export const makeValidateCredentials = (): ValidateCredentials => {
  const accountDbRepository = makeAccountDbRepository()
  const hasher = makeBcryptAdapter()

  return new ValidateCredentials(accountDbRepository, hasher)
}
