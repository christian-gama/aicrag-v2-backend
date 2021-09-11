import { ControllerProtocol, SignUpController } from '@/presentation/controllers/signup/'
import { makeAccountDbRepository } from '@/main/factories/repositories/account-db-repository/account-db-repository-factory'
import { makeAccountValidatorComposite } from '@/main/factories/validators/account-validator/account-validator-composite-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'

export const makeSignUpController = (): ControllerProtocol => {
  const accountDbRepository = makeAccountDbRepository()
  const accountValidator = makeAccountValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()

  return new SignUpController(accountDbRepository, accountValidator, filterUserData, httpHelper)
}
