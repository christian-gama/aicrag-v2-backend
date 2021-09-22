import { ControllerProtocol, SignUpController } from '@/presentation/controllers/authentication/signup/'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'
import { makeUserValidatorComposite } from '@/main/factories/validators/user-validator/user-validator-composite-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'
import { makeGenerateAccessToken } from '@/main/factories/providers/token/generate-access-token-factory'
import { makeWelcomeEmail } from '@/main/factories/services/mailer/welcome-email-factory'

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

  return makeTryCatchControllerDecorator(signUpController)
}
