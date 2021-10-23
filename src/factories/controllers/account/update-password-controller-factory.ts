import { UpdatePasswordController } from '@/presentation/controllers/account'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'

import { makeBcryptAdapter } from '../../cryptography'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '../../providers/token'
import { makeUserRepository } from '../../repositories'
import { makeUpdatePasswordValidator } from '../../validators/user'

export const makeUpdatePasswordController = (): IController => {
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const generateRefreshToken = makeGenerateRefreshToken()
  const hasher = makeBcryptAdapter()
  const httpHelper = makeHttpHelper()
  const updatePasswordValidator = makeUpdatePasswordValidator()
  const userRepository = makeUserRepository()

  const updatePasswordController = new UpdatePasswordController(
    filterUserData,
    generateAccessToken,
    generateRefreshToken,
    hasher,
    httpHelper,
    updatePasswordValidator,
    userRepository
  )

  return makeTryCatchDecorator(updatePasswordController)
}
