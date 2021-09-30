import { UpdateEmailByCodeController } from '@/presentation/controllers/account'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeUserDbRepository } from '../../repositories'
import { makeUpdateEmailByCodeValidatorComposite } from '../../validators'

export const makeUpdateEmailByCodeController = (): ControllerProtocol => {
  const updateEmailByCodeValidator = makeUpdateEmailByCodeValidatorComposite()
  const filterUserData = makeFilterUserData()

  const httpHelper = makeHttpHelper()
  const userDbRepository = makeUserDbRepository()

  const updateEmailByCodeController = new UpdateEmailByCodeController(
    updateEmailByCodeValidator,
    filterUserData,
    httpHelper,
    userDbRepository
  )

  return makeTryCatchDecorator(updateEmailByCodeController)
}
