import { SendEmailCodeController } from '@/presentation/controllers/mailer'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeEmailCode } from '../../mailer'
import { makeUserRepository } from '../../repositories'
import { makeSendEmailCodeValidatorComposite } from '../../validators/user'

export const makeSendEmailCodeController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const sendEmailCodeValidator = makeSendEmailCodeValidatorComposite()
  const userRepository = makeUserRepository()
  const emailCode = makeEmailCode()

  const sendEmailCodeController = new SendEmailCodeController(
    emailCode,
    httpHelper,
    sendEmailCodeValidator,
    userRepository
  )

  return makeTryCatchDecorator(sendEmailCodeController)
}
