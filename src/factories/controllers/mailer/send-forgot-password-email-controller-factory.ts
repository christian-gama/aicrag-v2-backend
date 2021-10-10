import { SendForgotPasswordEmailController } from '@/presentation/controllers/mailer'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeForgotPasswordEmail } from '../../mailer'
import { makeUserRepository } from '../../repositories'
import { makeForgotPasswordValidatorComposite } from '../../validators/user'

export const makeSendForgotPasswordEmailController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const forgotPasswordValidator = makeForgotPasswordValidatorComposite()
  const userRepository = makeUserRepository()
  const forgotPasswordEmail = makeForgotPasswordEmail()

  const sendForgotPasswordEmailController = new SendForgotPasswordEmailController(
    forgotPasswordEmail,
    forgotPasswordValidator,
    httpHelper,
    userRepository
  )

  return makeTryCatchDecorator(sendForgotPasswordEmailController)
}
