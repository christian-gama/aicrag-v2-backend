import { IUser } from '@/domain'

import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { MustLoginError } from '@/application/usecases/errors'

import { LogoutController } from '@/presentation/controllers/account'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: LogoutController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = { user: fakeUser }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new LogoutController(httpHelper, userDbRepositoryStub)

  return { sut, fakeUser, httpHelper, request, userDbRepositoryStub }
}

describe('LogoutController', () => {
  it('Should return MustLoginError if user is not logged in', async () => {
    const { sut, httpHelper, request } = makeSut()
    request.user = undefined

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.forbidden(new MustLoginError()))
  })

  it('Should call updateUser with correct values', async () => {
    const { sut, fakeUser, request, userDbRepositoryStub } = makeSut()
    const updateUser = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUser).toHaveBeenCalledWith(fakeUser, { tokenVersion: fakeUser.tokenVersion })
  })

  it('Should return ok if succeds', async () => {
    const { sut, request, httpHelper } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ message: "You've been logged out" }))
  })
})
