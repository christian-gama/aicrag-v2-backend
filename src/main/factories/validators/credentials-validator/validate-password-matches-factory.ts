import { ValidatePasswordMatches } from '@/application/usecases/validators/credentials'
import { makeAccountDbRepository } from '@/main/factories/repositories/account/account-db-repository/account-db-repository-factory'
import { makeBcryptAdapter } from '@/main/factories/cryptography/hasher-factory'

export const makeValidatePasswordMatches = (): ValidatePasswordMatches => {
  const accountDbRepository = makeAccountDbRepository()
  const hasher = makeBcryptAdapter()

  return new ValidatePasswordMatches(accountDbRepository, hasher)
}
