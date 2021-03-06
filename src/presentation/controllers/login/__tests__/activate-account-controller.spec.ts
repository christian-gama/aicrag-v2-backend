import { IPublicUser, IUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { InvalidPinError } from '@/application/errors'
import { ActivateAccountController } from '@/presentation/controllers/login'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import {
  makeValidatorStub,
  makeFakeUser,
  makeFakePublicUser,
  makeFilterUserDataStub,
  makeGenerateTokenStub,
  makeUserRepositoryStub
} from '@/tests/__mocks__'
import MockDate from 'mockdate'

interface SutTypes {
  activateAccountValidatorStub: IValidator
  fakePublicUser: IPublicUser
  fakeUser: IUser
  filterUserDataStub: IFilterUserData
  generateAccessTokenStub: IGenerateToken
  generateRefreshTokenStub: IGenerateToken
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: ActivateAccountController
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const activateAccountValidatorStub = makeValidatorStub()
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const generateAccessTokenStub = makeGenerateTokenStub()
  const generateRefreshTokenStub = makeGenerateTokenStub()
  const httpHelper = makeHttpHelper()
  const request = {
    body: { activationPin: fakeUser.temporary.activationPin, userId: fakeUser.personal.id }
  }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new ActivateAccountController(
    activateAccountValidatorStub,
    filterUserDataStub,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    httpHelper,
    userRepositoryStub
  )

  return {
    activateAccountValidatorStub,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    httpHelper,
    request,
    sut,
    userRepositoryStub
  }
}

describe('activateAccountController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call validate with correct values', async () => {
    const { activateAccountValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(activateAccountValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    const { activateAccountValidatorStub, httpHelper, request, sut } = makeSut()
    const error = new InvalidPinError()
    jest.spyOn(activateAccountValidatorStub, 'validate').mockReturnValueOnce(error)

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(error))
  })

  it('should call findById with correct id', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findById')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.userId)
  })

  it('should call filter with correct user', async () => {
    const { fakeUser, filterUserDataStub, request, sut } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call generateAccessToken.generate with correct values', async () => {
    const { fakeUser, generateAccessTokenStub, request, sut } = makeSut()
    const encryptSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call generateRefreshToken.generate with correct values', async () => {
    const { fakeUser, generateRefreshTokenStub, request, sut } = makeSut()
    const encryptSpy = jest.spyOn(generateRefreshTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call ok with correct values', async () => {
    const { fakeUser, httpHelper, request, sut } = makeSut()
    const filteredUser = makeFakePublicUser(fakeUser)
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({
      accessToken: 'any_token',
      refreshToken: 'any_token',
      user: filteredUser
    })
  })

  it('should activate account if validation succeeds', async () => {
    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.settings.accountActivated).toBe(true)
  })

  it('should clear temporaries if validation succeeds', async () => {
    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.temporary.activationPin).toBeNull()
    expect(fakeUser.temporary.activationPinExpiration).toBeNull()
  })

  it('should call updateById with correct values', async () => {
    const { fakeUser, sut, request, userRepositoryStub } = makeSut()
    const updateMeSpy = jest.spyOn(userRepositoryStub, 'updateById')

    await sut.handle(request)

    expect(updateMeSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'settings.accountActivated': fakeUser.settings.accountActivated,
      'temporary.activationPin': fakeUser.temporary.activationPin,
      'temporary.activationPinExpiration': fakeUser.temporary.activationPin
    })
  })
})
