import { LoginController } from '@/presentation/controllers/login'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '../../providers/token'
import { makeUserDbRepository } from '../../repositories'
import { makeCredentialsValidatorComposite } from '../../validators/user'

export const makeLoginController = (): ControllerProtocol => {
  const credentialsValidator = makeCredentialsValidatorComposite()
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const generateRefreshToken = makeGenerateRefreshToken()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()

  const loginController = new LoginController(
    credentialsValidator,
    filterUserData,
    generateAccessToken,
    generateRefreshToken,
    httpHelper,
    userDbRepository
  )

  return makeTryCatchDecorator(loginController)
}
