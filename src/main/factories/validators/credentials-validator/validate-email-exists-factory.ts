import { ValidateEmailExists } from '@/application/usecases/validators/credentials/'
import { makeAccountDbRepository } from '@/main/factories/repositories/account/account-db-repository/account-db-repository-factory'

export const makeValidateEmailExists = (): ValidateEmailExists => {
  const accountDbRepository = makeAccountDbRepository()

  return new ValidateEmailExists(accountDbRepository)
}
