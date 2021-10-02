import { IPublicUser, IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { InvalidCodeError } from '@/application/errors'

import { UpdateEmailByCodeController } from '@/presentation/controllers/account'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import {
  makeValidatorStub,
  makeFakeUser,
  makeFakePublicUser,
  makeFilterUserDataStub,
  makeUserDbRepositoryStub
} from '@/tests/__mocks__'

import { makeHttpHelper } from '@/factories/helpers'

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
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)

  const httpHelper = makeHttpHelper()
  const request = {
    body: { email: fakeUser.personal.email, emailCode: fakeUser.temporary.tempEmailCode }
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
  it('should call validate with correct values', async () => {
    expect.hasAssertions()

    const { updateEmailByCodeValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(updateEmailByCodeValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { updateEmailByCodeValidatorStub, httpHelper, request, sut } = makeSut()
    const error = new InvalidCodeError()
    jest.spyOn(updateEmailByCodeValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(error))
  })

  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
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

  it('should change email if validation succeds', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, request } = makeSut()
    const newEmail = fakeUser.temporary.tempEmail

    await sut.handle(request)

    expect(fakeUser.personal.email).toBe(newEmail)
  })

  it('should clear temporaries if validation succeds', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.temporary.tempEmail).toBeNull()
    expect(fakeUser.temporary.tempEmailCode).toBeNull()
    expect(fakeUser.temporary.tempEmailCodeExpiration).toBeNull()
  })

  it('should call updateUser twice', async () => {
    expect.hasAssertions()

    const { sut, request, userDbRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledTimes(2)
  })
})