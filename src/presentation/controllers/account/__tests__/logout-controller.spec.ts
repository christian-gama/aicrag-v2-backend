import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'

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
  userRepositoryStub: IUserRepository
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
    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.forbidden(new MustLoginError()))
  })

  it('should call updateById with correct values', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateById')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      tokenVersion: fakeUser.tokenVersion
    })
  })

  it('should return ok if succeeds', async () => {
    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ message: "You've been logged out" }))
  })
})
