import { UpdateUserController } from '@/presentation/controllers/account/update-user-controller'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper, makeValidationCode } from '../../helpers'
import { makeUserDbRepository } from '../../repositories'
import { makeValidateEmail, makeValidateName } from '../../validators'

export const makeUpdateUserController = (): ControllerProtocol => {
  const emailCode = makeValidationCode()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()
  const validateEmail = makeValidateEmail()
  const validateName = makeValidateName()

  const updateUserController = new UpdateUserController(
    emailCode,
    filterUserData,
    httpHelper,
    userDbRepository,
    validateEmail,
    validateName
  )

  return makeTryCatchDecorator(updateUserController)
}
