import { VerifyResetPasswordTokenController } from '@/presentation/controllers/helpers'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyResetPasswordToken } from '../../providers/token/verify-reset-password-token-factory'

export const makeVerifyResetPasswordTokenController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const verifyResetPasswordToken = makeVerifyResetPasswordToken()

  const verifyResetPasswordTokenController = new VerifyResetPasswordTokenController(httpHelper, verifyResetPasswordToken)

  return makeTryCatchDecorator(verifyResetPasswordTokenController)
}
