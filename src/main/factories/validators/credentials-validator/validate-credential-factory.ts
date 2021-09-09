import { ValidateCredentials } from '@/application/usecases/validators/credentials/validate-credentials'
import { makeBcryptAdapter } from '../../cryptography/hasher-factory'
import { makeAccountDbRepository } from '../../repositories/account-db-repository/account-db-repository-factory'

export const makeValidateCredentials = (): ValidateCredentials => {
  const accountDbRepository = makeAccountDbRepository()
  const hasher = makeBcryptAdapter()

  return new ValidateCredentials(accountDbRepository, hasher)
}
