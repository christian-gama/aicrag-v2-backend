import { IPublicUser, IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { InvalidCodeError, MustLoginError } from '@/application/errors'

import { UpdateEmailByCodeController } from '@/presentation/controllers/account'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeValidatorStub,
  makeFakeUser,
  makeFakePublicUser,
  makeFilterUserDataStub,
  makeUserDbRepositoryStub
} from '@/tests/__mocks__'

import MockDate from 'mockdate'

interface SutTypes {
  fakePublicUser: IPublicUser
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdateEmailByCodeController
  updateEmailByCodeValidatorStub: ValidatorProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const updateEmailByCodeValidatorStub = makeValidatorStub()
  const fakeUser = makeFakeUser()
  fakeUser.temporary.tempEmail = 'any_email@mail.com'
  fakeUser.temporary.tempEmailCode = 'any_code'
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)

  const httpHelper = makeHttpHelper()
  const request = {
    body: { emailCode: fakeUser.temporary.tempEmailCode },
    user: fakeUser
  }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new UpdateEmailByCodeController(
    updateEmailByCodeValidatorStub,
    filterUserDataStub,
    httpHelper,
    userDbRepositoryStub
  )

  return {
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    request,
    sut,
    updateEmailByCodeValidatorStub,
    userDbRepositoryStub
  }
}

describe('updateEmailByCodeController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call validate with correct values', async () => {
    expect.hasAssertions()

    const { updateEmailByCodeValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(updateEmailByCodeValidatorStub, 'validate')
    const data = Object.assign({ user: request.user }, request.body)

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(data)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { updateEmailByCodeValidatorStub, httpHelper, request, sut } = makeSut()
    const error = new InvalidCodeError()
    jest.spyOn(updateEmailByCodeValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(error))
  })

  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should call filter with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, filterUserDataStub, request, sut } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call ok with correct values', async () => {
    expect.hasAssertions()

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
    expect.hasAssertions()

    const { sut, fakeUser, request } = makeSut()
    const newEmail = fakeUser.temporary.tempEmail

    await sut.handle(request)

    expect(fakeUser.personal.email).toBe(newEmail)
  })

  it('should clear temporaries if validation succeeds', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.temporary.tempEmail).toBeNull()
    expect(fakeUser.temporary.tempEmailCode).toBeNull()
    expect(fakeUser.temporary.tempEmailCodeExpiration).toBeNull()
  })

  it('should call updateUser with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, sut, request, userDbRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.email': fakeUser.personal.email,
      'temporary.tempEmail': fakeUser.temporary.tempEmail,
      'temporary.tempEmailCode': fakeUser.temporary.tempEmailCode,
      'temporary.tempEmailCodeExpiration': fakeUser.temporary.tempEmailCodeExpiration
    })
  })
})
