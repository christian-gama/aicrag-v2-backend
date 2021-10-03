import { SendEmailCodeController } from '@/presentation/controllers/helpers'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeEmailCode } from '../../mailer'
import { makeUserDbRepository } from '../../repositories'
import { makeSendEmailCodeValidatorComposite } from '../../validators/user'

export const makeSendEmailCodeController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const sendEmailCodeValidator = makeSendEmailCodeValidatorComposite()
  const userDbRepository = makeUserDbRepository()
  const emailCode = makeEmailCode()

  const sendEmailCodeController = new SendEmailCodeController(
    emailCode,
    httpHelper,
    sendEmailCodeValidator,
    userDbRepository
  )

  return makeTryCatchDecorator(sendEmailCodeController)
}
