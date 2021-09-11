import { ValidateActiveAccount } from '@/application/usecases/validators/credentials/validate-active-account'
import { makeAccountDbRepository } from '../../repositories/account-db-repository/account-db-repository-factory'

export const makeValidateActiveAccount = (): ValidateActiveAccount => {
  const accountDbRepository = makeAccountDbRepository()

  return new ValidateActiveAccount(accountDbRepository)
}
