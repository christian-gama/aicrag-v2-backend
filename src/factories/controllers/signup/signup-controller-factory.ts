import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { SignUpController } from '@/presentation/controllers/signup'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken } from '../../providers/token'
import { makeUserRepository } from '../../repositories'
import { makeUserValidatorComposite } from '../../validators/user'

export const makeSignUpController = (): ControllerProtocol => {
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()
  const userValidator = makeUserValidatorComposite()

  const signUpController = new SignUpController(
    filterUserData,
    generateAccessToken,
    httpHelper,
    userRepository,
    userValidator
  )

  return makeTryCatchDecorator(signUpController)
}
