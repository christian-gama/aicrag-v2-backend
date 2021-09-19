import { ActivateAccountController } from '@/presentation/controllers/authentication/activate-account/activate-account-controller'
import { ControllerProtocol } from '@/presentation/controllers/authentication/login'
import { makeActivateAccountValidatorComposite } from '@/main/factories/validators/activate-account-validator'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'
import { makeGenerateAccessToken } from '@/main/factories/providers/generate-access-token-factory'
import { makeGenerateRefreshToken } from '@/main/factories/providers/generate-refresh-token-factory'

export const makeActivateAccountController = (): ControllerProtocol => {
  const activateAccountValidator = makeActivateAccountValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const generateAccessToken = makeGenerateAccessToken()
  const generateRefreshToken = makeGenerateRefreshToken()
  const userDbRepository = makeUserDbRepository()

  const activateUserController = new ActivateAccountController(
    activateAccountValidator,
    filterUserData,
    httpHelper,
    generateAccessToken,
    generateRefreshToken,
    userDbRepository
  )

  return makeTryCatchControllerDecorator(activateUserController)
}
