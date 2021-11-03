import { ResetPasswordController } from '@/presentation/controllers/login/reset-password-controller'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { makeBcryptAdapter } from '../../cryptography'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateRefreshToken } from '../../providers/token'
import { makeVerifyResetPasswordToken } from '../../providers/token/verify-reset-password-token-factory'
import { makeUserRepository } from '../../repositories'
import { makeResetPasswordValidator } from '../../validators/user/reset-password-validator-factory'

export const makeResetPasswordController = (): IController => {
  const filterUserData = makeFilterUserData()
  const generateRefreshToken = makeGenerateRefreshToken()
  const hasher = makeBcryptAdapter()
  const httpHelper = makeHttpHelper()
  const resetPasswordValidator = makeResetPasswordValidator()
  const userRepository = makeUserRepository()
  const verifyResetPasswordToken = makeVerifyResetPasswordToken()

  const resetPasswordController = new ResetPasswordController(
    filterUserData,
    generateRefreshToken,
    hasher,
    httpHelper,
    resetPasswordValidator,
    userRepository,
    verifyResetPasswordToken
  )

  return makeTryCatchDecorator(resetPasswordController)
}
