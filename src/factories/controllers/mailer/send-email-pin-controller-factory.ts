import { SendEmailPinController } from '@/presentation/controllers/mailer'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper, makePin } from '../../helpers'
import { makeEmailPin } from '../../mailer'
import { makeUserRepository } from '../../repositories'
import { makeSendEmailPinValidator } from '../../validators/user'

export const makeSendEmailPinController = (): IController => {
  const emailPin = makeEmailPin()
  const httpHelper = makeHttpHelper()
  const sendEmailPinValidator = makeSendEmailPinValidator()
  const userRepository = makeUserRepository()
  const validationCode = makePin()

  const sendEmailPinController = new SendEmailPinController(
    emailPin,
    httpHelper,
    sendEmailPinValidator,
    userRepository,
    validationCode
  )

  return makeTryCatchDecorator(sendEmailPinController)
}
