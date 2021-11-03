import { ForgotPasswordController } from '@/presentation/controllers/login'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken } from '../../providers/token'
import { makeUserRepository } from '../../repositories'
import { makeForgotPasswordValidator } from '../../validators/user'

export const makeForgotPasswordController = (): IController => {
  const filterUserData = makeFilterUserData()
  const forgotPasswordValidator = makeForgotPasswordValidator()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()

  const forgotPasswordController = new ForgotPasswordController(
    filterUserData,
    forgotPasswordValidator,
    generateAccessToken,
    httpHelper,
    userRepository
  )

  return makeTryCatchDecorator(forgotPasswordController)
}
