import { ResetPasswordController } from '@/presentation/controllers/login/reset-password-controller'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeBcryptAdapter } from '../../cryptography'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateRefreshToken } from '../../providers/token'
import { makeVerifyResetPasswordToken } from '../../providers/token/verify-reset-password-token-factory'
import { makeUserDbRepository } from '../../repositories'
import { makeResetPasswordValidatorComposite } from '../../validators/user/reset-password-validator-composite-factory'

export const makeResetPasswordController = (): ControllerProtocol => {
  const filterUserData = makeFilterUserData()
  const generateRefreshToken = makeGenerateRefreshToken()
  const hasher = makeBcryptAdapter()
  const httpHelper = makeHttpHelper()
  const resetPasswordValidator = makeResetPasswordValidatorComposite()
  const userDbRepository = makeUserDbRepository()
  const verifyResetPasswordToken = makeVerifyResetPasswordToken()

  const resetPasswordController = new ResetPasswordController(
    filterUserData,
    generateRefreshToken,
    hasher,
    httpHelper,
    resetPasswordValidator,
    userDbRepository,
    verifyResetPasswordToken
  )

  return makeTryCatchDecorator(resetPasswordController)
}
