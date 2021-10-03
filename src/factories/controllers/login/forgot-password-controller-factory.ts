import { ForgotPasswordController } from '@/presentation/controllers/login'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken } from '../../providers/token'
import { makeUserDbRepository } from '../../repositories'
import { makeForgotPasswordValidatorComposite } from '../../validators/user'

export const makeForgotPasswordController = (): ControllerProtocol => {
  const filterUserData = makeFilterUserData()
  const forgotPasswordValidator = makeForgotPasswordValidatorComposite()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()

  const forgotPasswordController = new ForgotPasswordController(
    filterUserData,
    forgotPasswordValidator,
    generateAccessToken,
    httpHelper,
    userDbRepository
  )

  return makeTryCatchDecorator(forgotPasswordController)
}
