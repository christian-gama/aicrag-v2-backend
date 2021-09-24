import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { VerifyResetPasswordTokenController } from '@/presentation/controllers/token'
import { makeTryCatchControllerDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyResetPasswordToken } from '../../providers/token/verify-reset-password-token-factory'

export const makeVerifyResetPasswordTokenController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const verifyResetPasswordToken = makeVerifyResetPasswordToken()

  const verifyTokenUrlController = new VerifyResetPasswordTokenController(httpHelper, verifyResetPasswordToken)

  return makeTryCatchControllerDecorator(verifyTokenUrlController)
}
