import { ForgotPasswordController } from '@/presentation/controllers/account'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeForgotPasswordEmail } from '../../mailer'
import { makeGenerateAccessToken } from '../../providers/token'
import { makeUserDbRepository } from '../../repositories'
import { makeForgotPasswordComposite } from '../../validators'

export const makeForgotPasswordController = (): ControllerProtocol => {
  const forgotPasswordEmail = makeForgotPasswordEmail()
  const forgotPasswordValidator = makeForgotPasswordComposite()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()

  const forgotPasswordController = new ForgotPasswordController(
    forgotPasswordEmail,
    forgotPasswordValidator,
    generateAccessToken,
    httpHelper,
    userDbRepository
  )

  return makeTryCatchDecorator(forgotPasswordController)
}
