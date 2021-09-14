import { ControllerProtocol, SignUpController } from '@/presentation/controllers/authentication/signup/'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'
import { makeUserValidatorComposite } from '@/main/factories/validators/user-validator/user-validator-composite-factory'
import { makeFilterUserData } from '@/main/factories/helpers/fitler-user-data-factory'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeTryCatchControllerDecorator } from '@/main/factories/decorators/try-catch-controller-decorator-factory'

export const makeSignUpController = (): ControllerProtocol => {
  const userDbRepository = makeUserDbRepository()
  const userValidator = makeUserValidatorComposite()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()

  const signUpController = new SignUpController(
    userDbRepository,
    userValidator,
    filterUserData,
    httpHelper
  )

  return makeTryCatchControllerDecorator(signUpController)
}
