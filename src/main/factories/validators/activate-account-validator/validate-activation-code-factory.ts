import { ValidateActivationCode } from '@/application/usecases/validators/codes/validate-activation-code'
import { makeAccountDbRepository } from '../../repositories/account/account-db-repository/account-db-repository-factory'

export const makeValidateActivationCode = (): ValidateActivationCode => {
  const accountDbRepository = makeAccountDbRepository()

  return new ValidateActivationCode(accountDbRepository)
}
