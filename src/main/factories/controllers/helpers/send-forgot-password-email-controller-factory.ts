import { SendForgotPasswordEmailController } from '@/presentation/controllers/helpers'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeForgotPasswordEmail } from '../../mailer'
import { makeUserDbRepository } from '../../repositories'
import { makeForgotPasswordValidatorComposite } from '../../validators'

export const makeSendForgotPasswordEmailController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const forgotPasswordValidator = makeForgotPasswordValidatorComposite()
  const userDbRepository = makeUserDbRepository()
  const forgotPasswordEmail = makeForgotPasswordEmail()

  const sendForgotPasswordEmailController = new SendForgotPasswordEmailController(
    forgotPasswordEmail,
    forgotPasswordValidator,
    httpHelper,
    userDbRepository
  )

  return makeTryCatchDecorator(sendForgotPasswordEmailController)
}
