import { SendEmailCodeController } from '@/presentation/controllers/mailer'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper, makeValidationCode } from '../../helpers'
import { makeEmailCode } from '../../mailer'
import { makeUserRepository } from '../../repositories'
import { makeSendEmailCodeValidator } from '../../validators/user'

export const makeSendEmailCodeController = (): IController => {
  const emailCode = makeEmailCode()
  const httpHelper = makeHttpHelper()
  const sendEmailCodeValidator = makeSendEmailCodeValidator()
  const userRepository = makeUserRepository()
  const validationCode = makeValidationCode()

  const sendEmailCodeController = new SendEmailCodeController(
    emailCode,
    httpHelper,
    sendEmailCodeValidator,
    userRepository,
    validationCode
  )

  return makeTryCatchDecorator(sendEmailCodeController)
}
