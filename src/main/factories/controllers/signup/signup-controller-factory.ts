import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { SignUpController } from '@/presentation/controllers/signup/signup-controller'
import { makeHttpHelper } from '../../helpers/http-helper-factory'
import { makeAccountDbRepository } from '../../repositories/account-db-repository/account-db-repository-factory'
import { makeAccountValidatorComposite } from '../../validators/account-validator/account-validator-composite-factory'

export const makeSignUpController = (): ControllerProtocol => {
  const accountDbRepository = makeAccountDbRepository()
  const accountValidator = makeAccountValidatorComposite()
  const httpHelper = makeHttpHelper()

  return new SignUpController(accountDbRepository, accountValidator, httpHelper)
}
