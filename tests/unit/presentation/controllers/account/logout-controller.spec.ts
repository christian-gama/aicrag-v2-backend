import { IUser } from '@/domain'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { MustLoginError } from '@/application/errors'

import { LogoutController } from '@/presentation/controllers/account'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import { makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: LogoutController
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = { user: fakeUser }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new LogoutController(httpHelper, userRepositoryStub)

  return { fakeUser, httpHelper, request, sut, userRepositoryStub }
}

describe('logoutController', () => {
  it('should return MustLoginError if user is not logged in', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.forbidden(new MustLoginError()))
  })

  it('should call updateUser with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, { tokenVersion: fakeUser.tokenVersion })
  })

  it('should return ok if succeeds', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ message: "You've been logged out" }))
  })
})
