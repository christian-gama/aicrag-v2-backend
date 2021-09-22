import { IUser } from '@/domain/user'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { LogoutController } from '@/presentation/controllers/authentication/logout/logout-controller'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'

interface SutTypes {
  sut: LogoutController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  userDbRepositoryStub: UserDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = { user: fakeUser }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new LogoutController(httpHelper, userDbRepositoryStub)

  return { sut, fakeUser, httpHelper, request, userDbRepositoryStub }
}
