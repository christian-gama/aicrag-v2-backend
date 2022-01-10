import { GetMeController } from '@/presentation/controllers/account/get-me-controller'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '../../decorators'
import { makeFilterUserData, makeHttpHelper } from '../../helpers'

export const makeGetMeController = (): IController => {
  const httpHelper = makeHttpHelper()
  const filterUserData = makeFilterUserData()

  const getMeController = new GetMeController(httpHelper, filterUserData)

  return makeTryCatchDecorator(getMeController)
}
