import { UpdateMeController } from '@/presentation/controllers/account/update-me-controller'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper, makePin } from '../../helpers'
import { makeUserRepository } from '../../repositories'
import { makeUpdateMeValidator } from '../../validators/user'

export const makeUpdateMeController = (): IController => {
  const emailPin = makePin()
  const filterUserData = makeFilterUserData()
  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()
  const updateMeValidator = makeUpdateMeValidator()

  const updateMeController = new UpdateMeController(
    emailPin,
    filterUserData,
    httpHelper,
    userRepository,
    updateMeValidator
  )

  return makeTryCatchDecorator(updateMeController)
}
