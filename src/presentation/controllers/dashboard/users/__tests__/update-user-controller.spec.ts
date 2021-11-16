import { IUser, IUserRole } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLoginError, PermissionError } from '@/application/errors'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeUser, makeUserRepositoryStub, makeValidatorStub } from '@/tests/__mocks__'
import MockDate from 'mockdate'
import { UpdateUserController } from '..'

interface SutTypes {
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: UpdateUserController
  updateUserValidatorStub: IValidator
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = {
    body: {
      accountStatus: 'active',
      email: fakeUser.personal.email,
      handicap: 0.8,
      name: fakeUser.personal.name,
      role: 'moderator',
      tokenVersion: 2
    },
    user: fakeUser
  }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const updateUserValidatorStub = makeValidatorStub()

  const sut = new UpdateUserController(httpHelper, updateUserValidatorStub, userRepositoryStub)

  return {
    fakeUser,
    httpHelper,
    request,
    sut,
    updateUserValidatorStub,
    userRepositoryStub
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
    delete request.user

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should call updateUserValidator with correct data', async () => {
    const { fakeUser, request, sut, updateUserValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(updateUserValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith({ user: fakeUser, ...request.body })
  })

  it('should return badRequest if updateUserValidator fails', async () => {
    const { httpHelper, request, sut, updateUserValidatorStub } = makeSut()
    jest.spyOn(updateUserValidatorStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return badRequest if updateUserValidator fails with a PermissionError', async () => {
    const { httpHelper, request, sut, updateUserValidatorStub } = makeSut()
    jest.spyOn(updateUserValidatorStub, 'validate').mockReturnValueOnce(new PermissionError())

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.forbidden(new PermissionError()))
  })

  it('should call updateById with correct values if only accountStatus is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.email
    delete request.body.handicap
    delete request.body.name
    delete request.body.role
    delete request.body.tokenVersion

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'settings.activateAccount': request.body.accountStatus === 'active'
    })
  })

  it('should call updateById with correct values if only email is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.accountStatus
    delete request.body.handicap
    delete request.body.name
    delete request.body.role
    delete request.body.tokenVersion

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.email': request.body.email
    })
  })

  it('should call updateById with correct values if only handicap is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.accountStatus
    delete request.body.email
    delete request.body.name
    delete request.body.role
    delete request.body.tokenVersion

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'settings.handicap': request.body.handicap
    })
  })

  it('should call updateById with correct values if only name is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.accountStatus
    delete request.body.email
    delete request.body.handicap
    delete request.body.role
    delete request.body.tokenVersion

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.name': request.body.name
    })
  })

  it('should call updateById with correct values if only role is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.accountStatus
    delete request.body.email
    delete request.body.handicap
    delete request.body.name
    delete request.body.tokenVersion

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'settings.role': IUserRole[request.body.role]
    })
  })

  it('should call updateById with correct values if only tokenVersion is changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')
    delete request.body.accountStatus
    delete request.body.email
    delete request.body.handicap
    delete request.body.name
    delete request.body.role

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      tokenVersion: request.body.tokenVersion
    })
  })

  it('should call updateById with correct values if accountStatus, email, handicap, name, role and tokenVersion are changed', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.email': request.body.email,
      'personal.name': request.body.name,
      'settings.activateAccount': request.body.accountStatus === 'active',
      'settings.handicap': request.body.handicap,
      'settings.role': IUserRole[request.body.role],
      tokenVersion: request.body.tokenVersion
    })
  })

  it('should return ok if succeeds with no changes', async () => {
    const { httpHelper, request, sut } = makeSut()
    delete request.body.accountStatus
    delete request.body.email
    delete request.body.handicap
    delete request.body.name
    delete request.body.role
    delete request.body.tokenVersion

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ message: 'No changes were made' }))
  })

  it('should return ok if succeeds', async () => {
    const { fakeUser, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ user: fakeUser }))
  })
})
