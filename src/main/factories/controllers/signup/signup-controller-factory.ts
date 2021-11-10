import { IController } from '@/presentation/controllers/protocols/controller.model'
import { SignUpController } from '@/presentation/controllers/signup'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken } from '../../providers/token'
import { makeUserRepository } from '../../repositories'
import { makeUserValidator } from '../../validators/user'

export const makeSignUpController = (): IController => {
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()
  const userValidator = makeUserValidator()

  const signUpController = new SignUpController(
    filterUserData,
    generateAccessToken,
    httpHelper,
    userRepository,
    userValidator
  )

  return makeTryCatchDecorator(signUpController)
}
