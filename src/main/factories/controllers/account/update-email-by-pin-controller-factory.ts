import { UpdateEmailByPinController } from '@/presentation/controllers/account'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'
import { makeUserRepository } from '../../repositories'
import { makeUpdateEmailByPinValidator } from '../../validators/user'

export const makeUpdateEmailByPinController = (): IController => {
  const updateEmailByPinValidator = makeUpdateEmailByPinValidator()
  const filterUserData = makeFilterUserData()

  const httpHelper = makeHttpHelper()
  const userRepository = makeUserRepository()

  const updateEmailByPinController = new UpdateEmailByPinController(
    updateEmailByPinValidator,
    filterUserData,
    httpHelper,
    userRepository
  )

  return makeTryCatchDecorator(updateEmailByPinController)
}
