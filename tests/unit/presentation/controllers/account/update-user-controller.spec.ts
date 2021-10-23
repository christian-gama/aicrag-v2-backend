import { IUser } from '@/domain'
import { IFilterUserData, IValidationCode } from '@/domain/helpers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { ConflictParamError, MustLoginError } from '@/application/errors'

import { UpdateUserController } from '@/presentation/controllers/account'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakePublicUser,
  makeFakeUser,
  makeFilterUserDataStub,
  makeUserRepositoryStub,
  makeValidationCodeStub,
  makeValidatorStub
} from '@/tests/__mocks__'

import MockDate from 'mockdate'

interface SutTypes {
  emailCodeStub: IValidationCode
  fakeUser: IUser
  filterUserDataStub: IFilterUserData
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdateUserController
  userRepositoryStub: IUserRepository
  validateCurrencyStub: IValidator
  validateEmailStub: IValidator
  validateNameStub: IValidator
}

const makeSut = (): SutTypes => {
  const emailCodeStub = makeValidationCodeStub()
  const fakeUser = makeFakeUser()
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = {
    body: { currency: 'BRL', email: fakeUser.personal.email, name: fakeUser.personal.name },
    user: fakeUser
  }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const validateCurrencyStub = makeValidatorStub()
  const validateEmailStub = makeValidatorStub()
  const validateNameStub = makeValidatorStub()

  const sut = new UpdateUserController(
    emailCodeStub,
    filterUserDataStub,
    httpHelper,
    userRepositoryStub,
    validateCurrencyStub,
    validateEmailStub,
    validateNameStub
  )

  return {
    emailCodeStub,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    request,
    sut,
    userRepositoryStub,
    validateCurrencyStub,
    validateEmailStub,
    validateNameStub
  }
}

describe('updateUserController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return unauthorized if user is not logged in', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should call validate currency with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, validateCurrencyStub } = makeSut()
    const validateSpy = jest.spyOn(validateCurrencyStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if currency validation fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateCurrencyStub } = makeSut()
    jest.spyOn(validateCurrencyStub, 'validate').mockReturnValueOnce(new Error())

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call validate name with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, validateNameStub } = makeSut()
    const validateSpy = jest.spyOn(validateNameStub, 'validate')
    request.body.email = undefined

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if name validation fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateNameStub } = makeSut()
    jest.spyOn(validateNameStub, 'validate').mockReturnValueOnce(new Error())
    request.body.email = undefined

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should not call validate name if there is no name', async () => {
    expect.hasAssertions()

    const { request, sut, validateNameStub } = makeSut()
    const validateSpy = jest.spyOn(validateNameStub, 'validate')
    request.body.name = undefined

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledTimes(0)
  })

  it('should return badRequest if email validation fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateEmailStub } = makeSut()
    jest.spyOn(validateEmailStub, 'validate').mockReturnValueOnce(new Error())

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should not call validate email if there is no email', async () => {
    expect.hasAssertions()

    const { request, sut, validateEmailStub } = makeSut()
    const validateSpy = jest.spyOn(validateEmailStub, 'validate')
    request.body.email = undefined

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledTimes(0)
  })

  it('should not call findUserByEmail if there is no email', async () => {
    expect.hasAssertions()

    const { request, sut, userRepositoryStub } = makeSut()
    const validateSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')
    request.body.email = undefined

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledTimes(0)
  })

  it('should call validate email with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, validateEmailStub } = makeSut()
    const validateSpy = jest.spyOn(validateEmailStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should return conflict if email already exists', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.conflict(new ConflictParamError('email')))
  })

  it('should call updateUser with correct values if only currency is changed', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))
    request.body.email = undefined
    request.body.name = undefined

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'settings.currency': request.body.currency
    })
  })

  it('should call updateUser with correct values if only name is changed', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))
    request.body.currency = undefined
    request.body.email = undefined

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.name': request.body.name
    })
  })

  it('should call updateUser with correct values if only email is changed', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))
    request.body.currency = undefined
    request.body.name = undefined

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'temporary.tempEmail': request.body.email,
      'temporary.tempEmailCode': 'any_code',
      'temporary.tempEmailCodeExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })
  })

  it('should call updateUser with correct values if currency, email and name are changed', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.name': request.body.name,
      'settings.currency': request.body.currency,
      'temporary.tempEmail': request.body.email,
      'temporary.tempEmailCode': 'any_code',
      'temporary.tempEmailCodeExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })
  })

  it('should call filter with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, filterUserDataStub, request, sut, userRepositoryStub } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return ok if succeeds with no changes', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))
    request.body.email = undefined
    request.body.name = undefined
    request.body.currency = undefined

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ message: 'No changes were made' }))
  })

  it('should return ok if succeeds', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ user: makeFakePublicUser(fakeUser) }))
  })
})
