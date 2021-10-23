import { SendForgotPasswordEmailController } from '@/presentation/controllers/mailer'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'

import { makeGenerateAccessToken, makeVerifyResetPasswordToken } from '@/factories/providers/token'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeForgotPasswordEmail } from '../../mailer'
import { makeUserRepository } from '../../repositories'
import { makeForgotPasswordEmailValidator } from '../../validators/user'

export const makeSendForgotPasswordEmailController = (): IController => {
  const forgotPasswordEmail = makeForgotPasswordEmail()
  const forgotPasswordEmailValidator = makeForgotPasswordEmailValidator()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()
  const verifyAccessToken = makeVerifyResetPasswordToken()

  const sendForgotPasswordEmailController = new SendForgotPasswordEmailController(
    forgotPasswordEmail,
    forgotPasswordEmailValidator,
    generateAccessToken,
    httpHelper,
    userRepository,
    verifyAccessToken
  )

  return makeTryCatchDecorator(sendForgotPasswordEmailController)
}
