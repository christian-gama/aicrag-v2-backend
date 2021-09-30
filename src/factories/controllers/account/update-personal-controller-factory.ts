import { UpdatePersonalController } from '@/presentation/controllers/account/update-personal-controller'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper, makeValidationCode } from '../../helpers'
import { makeUserDbRepository } from '../../repositories'
import { makeValidateEmail, makeValidateName } from '../../validators'

export const makeUpdatePersonalController = (): ControllerProtocol => {
  const emailCode = makeValidationCode()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()
  const validateEmail = makeValidateEmail()
  const validateName = makeValidateName()

  const updatePersonalController = new UpdatePersonalController(
    emailCode,
    filterUserData,
    httpHelper,
    userDbRepository,
    validateEmail,
    validateName
  )

  return makeTryCatchDecorator(updatePersonalController)
}
