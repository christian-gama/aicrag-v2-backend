import { IUser } from '@/domain'
import { IFilterUserData, IPin } from '@/domain/helpers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { ConflictParamError, MustLoginError } from '@/application/errors'
import { UpdateUserController } from '@/presentation/controllers/account'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import {
  makeFakePublicUser,
  makeFakeUser,
  makeFilterUserDataStub,
  makeUserRepositoryStub,
  makePinStub,
  makeValidatorStub
} from '@/tests/__mocks__'
import MockDate from 'mockdate'

interface SutTypes {
  emailPinStub: IPin
  fakeUser: IUser
  filterUserDataStub: IFilterUserData
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: UpdateUserController
  userRepositoryStub: IUserRepository
  validateCurrencyStub: IValidator
  validateEmailStub: IValidator
  validateNameStub: IValidator
}

const makeSut = (): SutTypes => {
  const emailPinStub = makePinStub()
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
    emailPinStub,
    filterUserDataStub,
    httpHelper,
    userRepositoryStub,
    validateCurrencyStub,
    validateEmailStub,
    validateNameStub
  )

  return {
    emailPinStub,
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
    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should call validate currency with correct data', async () => {
    const { request, sut, validateCurrencyStub } = makeSut()
    const validateSpy = jest.spyOn(validateCurrencyStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if currency validation fails', async () => {
    const { httpHelper, request, sut, validateCurrencyStub } = makeSut()
    jest.spyOn(validateCurrencyStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call validate name with correct data', async () => {
    const { request, sut, validateNameStub } = makeSut()
    const validateSpy = jest.spyOn(validateNameStub, 'validate')
    request.body.email = undefined

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if name validation fails', async () => {
    const { httpHelper, request, sut, validateNameStub } = makeSut()
    jest.spyOn(validateNameStub, 'validate').mockReturnValueOnce(new Error())
    request.body.email = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should not call validate name if there is no name', async () => {
    const { request, sut, validateNameStub } = makeSut()
    const validateSpy = jest.spyOn(validateNameStub, 'validate')
    request.body.name = undefined

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledTimes(0)
  })

  it('should return badRequest if email validation fails', async () => {
    const { httpHelper, request, sut, validateEmailStub } = makeSut()
    jest.spyOn(validateEmailStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should not call validate email if there is no email', async () => {
    const { request, sut, validateEmailStub } = makeSut()
    const validateSpy = jest.spyOn(validateEmailStub, 'validate')
    request.body.email = undefined

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledTimes(0)
  })

  it('should not call findByEmail if there is no email', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const validateSpy = jest.spyOn(userRepositoryStub, 'findByEmail')
    request.body.email = undefined

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledTimes(0)
  })

  it('should call validate email with correct data', async () => {
    const { request, sut, validateEmailStub } = makeSut()
    const validateSpy = jest.spyOn(validateEmailStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call findByEmail with correct email', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should return conflict if email already exists', async () => {
    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.conflict(new ConflictParamError('email')))
  })

  it('should call updateById with correct values if only currency is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateById')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    request.body.email = undefined
    request.body.name = undefined

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'settings.currency': request.body.currency
    })
  })

  it('should call updateById with correct values if only name is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateById')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    request.body.currency = undefined
    request.body.email = undefined

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.name': request.body.name
    })
  })

  it('should call updateById with correct values if only email is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateById')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    request.body.currency = undefined
    request.body.name = undefined

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'temporary.tempEmail': request.body.email,
      'temporary.tempEmailPin': 'any_pin',
      'temporary.tempEmailPinExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })
  })

  it('should call updateById with correct values if currency, email and name are changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateById')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.name': request.body.name,
      'settings.currency': request.body.currency,
      'temporary.tempEmail': request.body.email,
      'temporary.tempEmailPin': 'any_pin',
      'temporary.tempEmailPinExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })
  })

  it('should call filter with correct user', async () => {
    const { fakeUser, filterUserDataStub, request, sut, userRepositoryStub } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return ok if succeeds with no changes', async () => {
    const { httpHelper, request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    request.body.email = undefined
    request.body.name = undefined
    request.body.currency = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ message: 'No changes were made' }))
  })

  it('should return ok if succeeds', async () => {
    const { fakeUser, httpHelper, request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ user: makeFakePublicUser(fakeUser) }))
  })
})
