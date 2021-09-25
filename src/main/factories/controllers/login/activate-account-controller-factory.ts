import { ActivateAccountController } from '@/presentation/controllers/account'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '../../providers/token'
import { makeUserDbRepository } from '../../repositories'
import { makeActivateAccountValidatorComposite } from '../../validators'

export const makeActivateAccountController = (): ControllerProtocol => {
  const activateAccountValidator = makeActivateAccountValidatorComposite()
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const generateRefreshToken = makeGenerateRefreshToken()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()

  const activateUserController = new ActivateAccountController(
    activateAccountValidator,
    filterUserData,
    generateAccessToken,
    generateRefreshToken,
    httpHelper,
    userDbRepository
  )

  return makeTryCatchDecorator(activateUserController)
}
