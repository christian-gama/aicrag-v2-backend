import { ControllerProtocol } from '@/presentation/controllers/authentication/login'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAdapter } from '@/main/factories/cryptography/jwt-adapter-factory'
import { makeTryCatchControllerDecorator } from '../../../decorators/try-catch-controller-decorator-factory'
import { ActivateAccountController } from '@/presentation/controllers/authentication/activate-account/activate-account-controller'
import { makeActivateAccountValidatorComposite } from '@/main/factories/validators/activate-account-validator'

export const makeActivateAccountController = (): ControllerProtocol => {
  const userDbRepository = makeUserDbRepository()
  const activateAccountValidator = makeActivateAccountValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const jwtAdapter = makeJwtAdapter()

  const activateUserController = new ActivateAccountController(
    userDbRepository,
    activateAccountValidator,
    filterUserData,
    httpHelper,
    jwtAdapter
  )

  return makeTryCatchControllerDecorator(activateUserController)
}
