import { IPublicUser, IUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { InvalidPinError, MustLoginError } from '@/application/errors'

import { UpdateEmailByPinController } from '@/presentation/controllers/account'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeValidatorStub,
  makeFakeUser,
  makeFakePublicUser,
  makeFilterUserDataStub,
  makeUserRepositoryStub
} from '@/tests/__mocks__'

import MockDate from 'mockdate'

interface SutTypes {
  fakePublicUser: IPublicUser
  fakeUser: IUser
  filterUserDataStub: IFilterUserData
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdateEmailByPinController
  updateEmailByPinValidatorStub: IValidator
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const updateEmailByPinValidatorStub = makeValidatorStub()
  const fakeUser = makeFakeUser()
  fakeUser.temporary.tempEmail = 'any_email@mail.com'
  fakeUser.temporary.tempEmailPin = 'any_pin'
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)

  const httpHelper = makeHttpHelper()
  const request = {
    body: { emailPin: fakeUser.temporary.tempEmailPin },
    user: fakeUser
  }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new UpdateEmailByPinController(
    updateEmailByPinValidatorStub,
    filterUserDataStub,
    httpHelper,
    userRepositoryStub
  )

  return {
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    request,
    sut,
    updateEmailByPinValidatorStub,
    userRepositoryStub
  }
}

describe('updateEmailByPinController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call validate with correct values', async () => {
    const { updateEmailByPinValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(updateEmailByPinValidatorStub, 'validate')
    const data = Object.assign({ user: request.user }, request.body)

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(data)
  })

  it('should return badRequest if validation fails', async () => {
    const { updateEmailByPinValidatorStub, httpHelper, request, sut } = makeSut()
    const error = new InvalidPinError()
    jest.spyOn(updateEmailByPinValidatorStub, 'validate').mockReturnValueOnce(error)

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(error))
  })

  it('should return unauthorized if there is no user', async () => {
    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should call filter with correct user', async () => {
    const { fakeUser, filterUserDataStub, request, sut } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call ok with correct values', async () => {
    const { fakeUser, httpHelper, request, sut } = makeSut()
    const filteredUser = makeFakePublicUser(fakeUser)
    filteredUser.personal.email = fakeUser.temporary.tempEmail as string

    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({
      user: filteredUser
    })
  })

  it('should change email if validation succeeds', async () => {
    const { sut, fakeUser, request } = makeSut()
    const newEmail = fakeUser.temporary.tempEmail

    await sut.handle(request)

    expect(fakeUser.personal.email).toBe(newEmail)
  })

  it('should clear temporaries if validation succeeds', async () => {
    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.temporary.tempEmail).toBeNull()
    expect(fakeUser.temporary.tempEmailPin).toBeNull()
    expect(fakeUser.temporary.tempEmailPinExpiration).toBeNull()
  })

  it('should call updateById with correct values', async () => {
    const { fakeUser, sut, request, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateById')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.email': fakeUser.personal.email,
      'temporary.tempEmail': fakeUser.temporary.tempEmail,
      'temporary.tempEmailPin': fakeUser.temporary.tempEmailPin,
      'temporary.tempEmailPinExpiration': fakeUser.temporary.tempEmailPinExpiration
    })
  })
})
