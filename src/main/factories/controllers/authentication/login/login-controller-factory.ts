import {
  ControllerProtocol,
  LoginController
} from '@/presentation/controllers/authentication/login'
import { makeCredentialsValidatorComposite } from '@/main/factories/validators/credentials-validator/credentials-validator-composite-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAccessToken } from '@/main/factories/cryptography/jwt-access-token-factory'
import { makeJwtRefreshToken } from '@/main/factories/cryptography/jwt-refresh-token-factory'
import { makeRefreshTokenDbRepository } from '@/main/factories/repositories/refresh-token/refresh-token-db-repository/refresh-token-db-repository-factory'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'

export const makeLoginController = (): ControllerProtocol => {
  const credentialsValidator = makeCredentialsValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const jwtRefreshToken = makeJwtRefreshToken()
  const refreshTokenDbRepository = makeRefreshTokenDbRepository()
  const userDbRepository = makeUserDbRepository()

  const loginController = new LoginController(
    credentialsValidator,
    filterUserData,
    httpHelper,
    jwtAccessToken,
    jwtRefreshToken,
    refreshTokenDbRepository,
    userDbRepository
  )

  return makeTryCatchControllerDecorator(loginController)
}
