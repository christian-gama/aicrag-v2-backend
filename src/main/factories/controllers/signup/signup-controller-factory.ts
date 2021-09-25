import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { SignUpController } from '@/presentation/controllers/signup'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeWelcomeEmail } from '../../mailer'
import { makeGenerateAccessToken } from '../../providers/token'
import { makeUserDbRepository } from '../../repositories'
import { makeUserValidatorComposite } from '../../validators'

export const makeSignUpController = (): ControllerProtocol => {
  const filterUserData = makeFilterUserData()
  const generateAccessToken = makeGenerateAccessToken()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()
  const userValidator = makeUserValidatorComposite()
  const welcomeEmail = makeWelcomeEmail()

  const signUpController = new SignUpController(
    filterUserData,
    generateAccessToken,
    httpHelper,
    userDbRepository,
    userValidator,
    welcomeEmail
  )

  return makeTryCatchDecorator(signUpController)
}
