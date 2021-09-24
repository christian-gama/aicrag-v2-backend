import { LoginController } from '@/presentation/controllers/login'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchControllerDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '../../providers/token'
import { makeUserDbRepository } from '../../repositories'
import { makeCredentialsValidatorComposite } from '../../validators'

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
