import { ControllerProtocol, LoginController } from '@/presentation/controllers/authentication/login'
import { makeAccountDbRepository } from '@/main/factories/repositories/account/account-db-repository/account-db-repository-factory'
import { makeCredentialsValidatorComposite } from '@/main/factories/validators/credentials-validator/credentials-validator-composite-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAdapter } from '@/main/factories/cryptography/jwt-adapter-factory'
import { makeTryCatchControllerDecorator } from '../../decorators/try-catch-controller-decorator-factory'

export const makeLoginController = (): ControllerProtocol => {
  const accountDbRepository = makeAccountDbRepository()
  const credentialsValidator = makeCredentialsValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const jwtAdapter = makeJwtAdapter()

  const loginController = new LoginController(
    accountDbRepository,
    credentialsValidator,
    filterUserData,
    httpHelper,
    jwtAdapter
  )

  return makeTryCatchControllerDecorator(loginController)
}
