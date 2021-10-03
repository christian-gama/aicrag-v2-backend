import { SendWelcomeEmailController } from '@/presentation/controllers/helpers'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeWelcomeEmail } from '../../mailer'
import { makeUserDbRepository } from '../../repositories'
import { makeSendWelcomeEmailValidatorComposite } from '../../validators/user'

export const makeSendWelcomeEmailController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const sendWelcomeValidator = makeSendWelcomeEmailValidatorComposite()
  const userDbRepository = makeUserDbRepository()
  const welcomeEmail = makeWelcomeEmail()

  const sendWelcomeEmailController = new SendWelcomeEmailController(
    httpHelper,
    sendWelcomeValidator,
    userDbRepository,
    welcomeEmail
  )

  return makeTryCatchDecorator(sendWelcomeEmailController)
}
