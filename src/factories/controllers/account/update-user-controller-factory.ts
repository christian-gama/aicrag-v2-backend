import { UpdateUserController } from '@/presentation/controllers/account/update-user-controller'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper, makeValidationCode } from '../../helpers'
import { makeUserDbRepository } from '../../repositories'
import { makeValidateEmail, makeValidateName } from '../../validators'

import { makeValidateCurrency } from '@/factories/validators/validate-currency-factory'

export const makeUpdateUserController = (): ControllerProtocol => {
  const emailCode = makeValidationCode()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()
  const validateCurrency = makeValidateCurrency()
  const validateEmail = makeValidateEmail()
  const validateName = makeValidateName()

  const updateUserController = new UpdateUserController(
    emailCode,
    filterUserData,
    httpHelper,
    userDbRepository,
    validateCurrency,
    validateEmail,
    validateName
  )

  return makeTryCatchDecorator(updateUserController)
}
