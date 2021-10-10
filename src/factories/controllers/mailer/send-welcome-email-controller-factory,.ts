import { SendWelcomeEmailController } from '@/presentation/controllers/mailer'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeWelcomeEmail } from '../../mailer'
import { makeUserRepository } from '../../repositories'
import { makeSendWelcomeEmailValidatorComposite } from '../../validators/user'

export const makeSendWelcomeEmailController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const sendWelcomeValidator = makeSendWelcomeEmailValidatorComposite()
  const userRepository = makeUserRepository()
  const welcomeEmail = makeWelcomeEmail()

  const sendWelcomeEmailController = new SendWelcomeEmailController(
    httpHelper,
    sendWelcomeValidator,
    userRepository,
    welcomeEmail
  )

  return makeTryCatchDecorator(sendWelcomeEmailController)
}
