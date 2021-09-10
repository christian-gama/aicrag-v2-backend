import { LoginController } from '@/presentation/controllers/login/login-controller'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { makeJwtAdapter } from '../../cryptography/jwt-adapter-factory'
import { makeFilterUserData } from '../../helpers/fitler-user-data-factory'
import { makeHttpHelper } from '../../helpers/http-helper-factory'
import { makeAccountDbRepository } from '../../repositories/account-db-repository/account-db-repository-factory'
import { makeCredentialsValidatorComposite } from '../../validators/credentials-validator/credentials-validator-composite-factory'

export const makeLoginController = (): ControllerProtocol => {
  const accountDbRepository = makeAccountDbRepository()
  const credentialsValidator = makeCredentialsValidatorComposite()
  const jwtAdapter = makeJwtAdapter()
  const httpHelper = makeHttpHelper()
  const filterUserData = makeFilterUserData()

  return new LoginController(
    accountDbRepository,
    credentialsValidator,
    httpHelper,
    jwtAdapter,
    filterUserData
  )
}
