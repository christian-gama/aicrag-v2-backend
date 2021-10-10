import { UpdateEmailByCodeController } from '@/presentation/controllers/account'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeUserRepository } from '../../repositories'
import { makeUpdateEmailByCodeValidatorComposite } from '../../validators/user'

export const makeUpdateEmailByCodeController = (): ControllerProtocol => {
  const updateEmailByCodeValidator = makeUpdateEmailByCodeValidatorComposite()
  const filterUserData = makeFilterUserData()

  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()

  const updateEmailByCodeController = new UpdateEmailByCodeController(
    updateEmailByCodeValidator,
    filterUserData,
    httpHelper,
    userRepository
  )

  return makeTryCatchDecorator(updateEmailByCodeController)
}
