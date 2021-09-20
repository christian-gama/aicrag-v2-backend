import { IUser } from '@/domain/user'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { LogoutController } from '@/presentation/controllers/authentication/logout/logout-controller'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: LogoutController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = { user: fakeUser }

  const sut = new LogoutController(httpHelper)

  return { sut, fakeUser, httpHelper, request }
}
