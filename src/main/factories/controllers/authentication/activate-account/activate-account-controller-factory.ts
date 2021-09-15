import { ActivateAccountController } from '@/presentation/controllers/authentication/activate-account/activate-account-controller'
import { ControllerProtocol } from '@/presentation/controllers/authentication/login'
import { makeActivateAccountValidatorComposite } from '@/main/factories/validators/activate-account-validator'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAccessToken } from '@/main/factories/cryptography/jwt-access-token-factory'
import { makeJwtRefreshToken } from '@/main/factories/cryptography/jwt-refresh-token-factory'
import { makeRefreshTokenDbRepository } from '@/main/factories/repositories/refresh-token/refresh-token-db-repository/refresh-token-db-repository-factory'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'

export const makeActivateAccountController = (): ControllerProtocol => {
  const activateAccountValidator = makeActivateAccountValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const jwtRefreshToken = makeJwtRefreshToken()
  const refreshTokenDbRepository = makeRefreshTokenDbRepository()
  const userDbRepository = makeUserDbRepository()

  const activateUserController = new ActivateAccountController(
    activateAccountValidator,
    filterUserData,
    httpHelper,
    jwtAccessToken,
    jwtRefreshToken,
    refreshTokenDbRepository,
    userDbRepository
  )

  return makeTryCatchControllerDecorator(activateUserController)
}
