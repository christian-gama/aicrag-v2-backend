import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { LoginController } from '@/presentation/controllers/authentication/login'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeGenerateAccessToken } from '@/main/factories/providers/token/generate-access-token-factory'
import { makeGenerateRefreshToken } from '@/main/factories/providers/token/generate-refresh-token-factory'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'
import { makeCredentialsValidatorComposite } from '@/main/factories/validators/credentials-validator'

export const makeLoginController = (): ControllerProtocol => {
  const credentialsValidator = makeCredentialsValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const generateAccessToken = makeGenerateAccessToken()
  const generateRefreshToken = makeGenerateRefreshToken()
  const userDbRepository = makeUserDbRepository()

  const loginController = new LoginController(
    credentialsValidator,
    filterUserData,
    httpHelper,
    generateAccessToken,
    generateRefreshToken,
    userDbRepository
  )

  return makeTryCatchControllerDecorator(loginController)
}
