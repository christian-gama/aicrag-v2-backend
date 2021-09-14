import { ControllerProtocol, LoginController } from '@/presentation/controllers/authentication/login'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'
import { makeCredentialsValidatorComposite } from '@/main/factories/validators/credentials-validator/credentials-validator-composite-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAdapter } from '@/main/factories/cryptography/jwt-adapter-factory'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'

export const makeLoginController = (): ControllerProtocol => {
  const userDbRepository = makeUserDbRepository()
  const credentialsValidator = makeCredentialsValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const jwtAdapter = makeJwtAdapter()

  const loginController = new LoginController(
    userDbRepository,
    credentialsValidator,
    filterUserData,
    httpHelper,
    jwtAdapter
  )

  return makeTryCatchControllerDecorator(loginController)
}
