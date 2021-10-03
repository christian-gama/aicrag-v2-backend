import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { SignUpController } from '@/presentation/controllers/signup'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeGenerateAccessToken } from '../../providers/token'
import { makeUserDbRepository } from '../../repositories'
import { makeUserValidatorComposite } from '../../validators/user'

export const makeSignUpController = (): ControllerProtocol => {
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()
  const userValidator = makeUserValidatorComposite()

  const signUpController = new SignUpController(
    filterUserData,
    generateAccessToken,
    httpHelper,
    userDbRepository,
    userValidator
  )

  return makeTryCatchDecorator(signUpController)
}
