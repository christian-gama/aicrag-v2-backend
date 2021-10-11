import { ActivateAccountController } from '@/presentation/controllers/login'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '../../providers/token'
import { makeUserRepository } from '../../repositories'
import { makeActivateAccountValidator } from '../../validators/user'

export const makeActivateAccountController = (): ControllerProtocol => {
  const activateAccountValidator = makeActivateAccountValidator()
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const generateRefreshToken = makeGenerateRefreshToken()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()

  const activateUserController = new ActivateAccountController(
    activateAccountValidator,
    filterUserData,
    generateAccessToken,
    generateRefreshToken,
    httpHelper,
    userRepository
  )

  return makeTryCatchDecorator(activateUserController)
}
