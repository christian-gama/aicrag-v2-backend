import { ActivateAccountController } from '@/presentation/controllers/account'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { makeTryCatchControllerDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '../../providers/token'
import { makeUserDbRepository } from '../../repositories'
import { makeActivateAccountValidatorComposite } from '../../validators'

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
