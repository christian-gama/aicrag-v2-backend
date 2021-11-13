import { IUser } from '@/domain'
import { IFilterUserData, IPin } from '@/domain/helpers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { UpdateMeController } from '@/presentation/controllers/account'
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
  sut: UpdateMeController
  updateMeValidatorStub: IValidator
  userRepositoryStub: IUserRepository
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
  const updateMeValidatorStub = makeValidatorStub()

  const sut = new UpdateMeController(
    emailPinStub,
    filterUserDataStub,
    httpHelper,
    userRepositoryStub,
    updateMeValidatorStub
  )

  return {
    emailPinStub,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    request,
    sut,
    updateMeValidatorStub,
    userRepositoryStub
  }
}

describe('updateMeController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return unauthorized if user is not logged in', async () => {
    const { httpHelper, request, sut } = makeSut()
    delete request.user

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should call updateMeValidator with correct data', async () => {
    const { request, sut, updateMeValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(updateMeValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if updateMeValidator fails', async () => {
    const { httpHelper, request, sut, updateMeValidatorStub } = makeSut()
    jest.spyOn(updateMeValidatorStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should not call findByEmail if there is no email', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const findByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')
    delete request.body.email

    await sut.handle(request)

    expect(findByEmailSpy).toHaveBeenCalledTimes(0)
  })

  it('should call updateById with correct values if only currency is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.email
    delete request.body.name
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'settings.currency': request.body.currency
    })
  })

  it('should call updateById with correct values if only name is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.currency
    delete request.body.email
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.name': request.body.name
    })
  })

  it('should call updateById with correct values if only email is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.currency
    delete request.body.name
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'temporary.tempEmail': request.body.email,
      'temporary.tempEmailPin': 'any_pin',
      'temporary.tempEmailPinExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })
  })

  it('should call updateById with correct values if currency, email and name are changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
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
    delete request.body.email
    delete request.body.name
    delete request.body.currency
    jest.spyOn(userRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))

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
