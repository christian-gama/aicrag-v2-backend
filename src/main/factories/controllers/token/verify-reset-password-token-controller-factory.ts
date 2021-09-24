import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { VerifyResetPasswordTokenController } from '@/presentation/controllers/token'
import { makeTryCatchControllerDecorator } from '../../decorators'
import { makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken } from '../../providers/token'
import { makeVerifyResetPasswordToken } from '../../providers/token/verify-reset-password-token-factory'

export const makeVerifyResetPasswordTokenController = (): ControllerProtocol => {
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const verifyResetPasswordToken = makeVerifyResetPasswordToken()

  const verifyResetPasswordTokenController = new VerifyResetPasswordTokenController(generateAccessToken, httpHelper, verifyResetPasswordToken)

  return makeTryCatchControllerDecorator(verifyResetPasswordTokenController)
}
