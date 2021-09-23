import { ControllerProtocol } from '@/presentation/controllers/authentication/login'
import { ForgotPasswordController } from '@/presentation/controllers/authentication/forgot-password/forgot-password-controller'
import { makeForgotPasswordComposite } from '@/main/factories/validators/forgot-password-validator'
import { makeForgotPasswordEmail } from '@/main/factories/services/mailer/forgot-password-email-factory'
import { makeGenerateAccessToken } from '@/main/factories/providers/token/generate-access-token-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'

export const makeForgotPasswordController = (): ControllerProtocol => {
  const forgotPasswordEmail = makeForgotPasswordEmail()
  const forgotPasswordValidator = makeForgotPasswordComposite()
  const httpHelper = makeHttpHelper()
  const generateAccessToken = makeGenerateAccessToken()
  const userDbRepository = makeUserDbRepository()

  const forgotPasswordController = new ForgotPasswordController(
    forgotPasswordEmail,
    forgotPasswordValidator,
    httpHelper,
    generateAccessToken,
    userDbRepository
  )

  return makeTryCatchControllerDecorator(forgotPasswordController)
}
