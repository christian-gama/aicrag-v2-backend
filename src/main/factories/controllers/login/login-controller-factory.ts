import { LoginController } from '@/presentation/controllers/login'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken, makeGenerateRefreshToken } from '../../providers/token'
import { makeUserRepository } from '../../repositories'
import { makeLoginValidator } from '../../validators/user'

export const makeLoginController = (): IController => {
  const loginValidator = makeLoginValidator()
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const generateRefreshToken = makeGenerateRefreshToken()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()

  const loginController = new LoginController(
    loginValidator,
    filterUserData,
    generateAccessToken,
    generateRefreshToken,
    httpHelper,
    userRepository
  )

  return makeTryCatchDecorator(loginController)
}
