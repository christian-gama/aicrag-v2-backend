import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { SignUpController } from '@/presentation/controllers/signup/signup-controllers'
import { HttpHelper } from '@/presentation/http/helper/http-helper'
import { makeAccountDbRepository } from '../../repositories/account-db-repository/account-db-repository-factory'
import { makeAccountValidatorComposite } from '../../validators/account-validator/account-validator-composite-factory'

export const makeSignUpController = (): ControllerProtocol => {
  const accountDbRepository = makeAccountDbRepository()
  const accountValidator = makeAccountValidatorComposite()
  const httpHelper = new HttpHelper()

  return new SignUpController(accountDbRepository, accountValidator, httpHelper)
}
