import { ControllerProtocol } from '@/presentation/controllers/authentication/login'
import { makeAccountDbRepository } from '@/main/factories/repositories/account/account-db-repository/account-db-repository-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAdapter } from '@/main/factories/cryptography/jwt-adapter-factory'
import { makeTryCatchControllerDecorator } from '../../../decorators/try-catch-controller-decorator-factory'
import { ActivateAccountController } from '@/presentation/controllers/authentication/activate-account/activate-account-controller'
import { makeActivateAccountValidatorComposite } from '@/main/factories/validators/activate-account-validator'

export const makeActivateAccountController = (): ControllerProtocol => {
  const accountDbRepository = makeAccountDbRepository()
  const activateAccountValidator = makeActivateAccountValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const jwtAdapter = makeJwtAdapter()

  const activateAccountController = new ActivateAccountController(
    accountDbRepository,
    activateAccountValidator,
    filterUserData,
    httpHelper,
    jwtAdapter
  )

  return makeTryCatchControllerDecorator(activateAccountController)
}
