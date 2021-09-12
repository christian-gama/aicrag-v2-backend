import { ControllerProtocol, SignUpController } from '@/presentation/controllers/authentication/signup/'
import { makeAccountDbRepository } from '@/main/factories/repositories/account/account-db-repository/account-db-repository-factory'
import { makeAccountValidatorComposite } from '@/main/factories/validators/account-validator/account-validator-composite-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeTryCatchControllerDecorator } from '../../decorators/try-catch-controller-decorator-factory'

export const makeSignUpController = (): ControllerProtocol => {
  const accountDbRepository = makeAccountDbRepository()
  const accountValidator = makeAccountValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()

  const signUpController = new SignUpController(
    accountDbRepository,
    accountValidator,
    filterUserData,
    httpHelper
  )

  return makeTryCatchControllerDecorator(signUpController)
}
