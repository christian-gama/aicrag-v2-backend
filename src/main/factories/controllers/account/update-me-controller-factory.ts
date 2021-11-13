import { UpdateMeController } from '@/presentation/controllers/account/update-me-controller'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper, makePin } from '../../helpers'
import { makeUserRepository } from '../../repositories'
import { makeValidateEmail, makeValidateName } from '../../validators/user'
import { makeValidateCurrency } from '../../validators/user/validate-currency-factory'

export const makeUpdateMeController = (): IController => {
  const emailPin = makePin()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()
  const validateCurrency = makeValidateCurrency()
  const validateEmail = makeValidateEmail()
  const validateName = makeValidateName()

  const updateMeController = new UpdateMeController(
    emailPin,
    filterUserData,
    httpHelper,
    userRepository,
    validateCurrency,
    validateEmail,
    validateName
  )

  return makeTryCatchDecorator(updateMeController)
}
