import { SendRecoverPasswordController } from '@/presentation/controllers/mailer'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { makeGenerateAccessToken, makeVerifyResetPasswordToken } from '@/main/factories/providers/token'
import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeRecoverPasswordEmail } from '../../mailer'
import { makeUserRepository } from '../../repositories'
import { makeRecoverPasswordEmailValidator } from '../../validators/user'

export const makeSendRecoverPasswordEmailController = (): IController => {
  const forgotPasswordEmail = makeRecoverPasswordEmail()
  const sendRecoverPasswordValidator = makeRecoverPasswordEmailValidator()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()
  const verifyAccessToken = makeVerifyResetPasswordToken()

  const sendRecoverPasswordController = new SendRecoverPasswordController(
    forgotPasswordEmail,
    sendRecoverPasswordValidator,
    generateAccessToken,
    httpHelper,
    userRepository,
    verifyAccessToken
  )

  return makeTryCatchDecorator(sendRecoverPasswordController)
}
