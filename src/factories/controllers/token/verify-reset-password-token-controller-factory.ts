import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { VerifyResetPasswordTokenController } from '@/presentation/controllers/token'

import { makeTryCatchDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyResetPasswordToken } from '../../providers/token'

export const makeVerifyResetPasswordTokenController = (): IController => {
  const httpHelper = makeHttpHelper()
  const verifyResetPasswordToken = makeVerifyResetPasswordToken()

  const verifyResetPasswordTokenController = new VerifyResetPasswordTokenController(
    httpHelper,
    verifyResetPasswordToken
  )

  return makeTryCatchDecorator(verifyResetPasswordTokenController)
}
