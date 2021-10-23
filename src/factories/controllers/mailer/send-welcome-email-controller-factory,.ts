import { SendWelcomeEmailController } from '@/presentation/controllers/mailer'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper, makeValidationCode } from '../../helpers'
import { makeWelcomeEmail } from '../../mailer'
import { makeUserRepository } from '../../repositories'
import { makeSendWelcomeEmailValidator } from '../../validators/user'

export const makeSendWelcomeEmailController = (): IController => {
  const httpHelper = makeHttpHelper()
  const sendWelcomeValidator = makeSendWelcomeEmailValidator()
  const userRepository = makeUserRepository()
  const validationCode = makeValidationCode()
  const welcomeEmail = makeWelcomeEmail()

  const sendWelcomeEmailController = new SendWelcomeEmailController(
    httpHelper,
    sendWelcomeValidator,
    userRepository,
    validationCode,
    welcomeEmail
  )

  return makeTryCatchDecorator(sendWelcomeEmailController)
}
