import { IPublicUser, IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { InvalidCodeError } from '@/application/errors'

import { ActivateAccountController } from '@/presentation/controllers/login'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import {
  makeValidatorStub,
  makeFakeUser,
  makeFakePublicUser,
  makeFilterUserDataStub,
  makeGenerateTokenStub,
  makeUserDbRepositoryStub
} from '@/tests/__mocks__'

import { makeHttpHelper } from '@/factories/helpers'
import MockDate from 'mockdate'

interface SutTypes {
  activateAccountValidatorStub: ValidatorProtocol
  fakePublicUser: IPublicUser
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  generateAccessTokenStub: GenerateTokenProtocol
  generateRefreshTokenStub: GenerateTokenProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: ActivateAccountController
  userDbRepositoryStub: UserDbRepositoryProtocol
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
    body: { activationCode: fakeUser.temporary.activationCode, email: fakeUser.personal.email }
  }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ActivateAccountController(
    activateAccountValidatorStub,
    filterUserDataStub,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    httpHelper,
    userDbRepositoryStub
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
    userDbRepositoryStub
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
    expect.hasAssertions()

    const { activateAccountValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(activateAccountValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { activateAccountValidatorStub, httpHelper, request, sut } = makeSut()
    const error = new InvalidCodeError()
    jest.spyOn(activateAccountValidatorStub, 'validate').mockReturnValueOnce(error)

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

  it('should call generateAccessToken.generate with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, generateAccessTokenStub, request, sut } = makeSut()
    const encryptSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call generateRefreshToken.generate with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, generateRefreshTokenStub, request, sut } = makeSut()
    const encryptSpy = jest.spyOn(generateRefreshTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call ok with correct values', async () => {
    expect.hasAssertions()

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
    expect.hasAssertions()

    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.settings.accountActivated).toBe(true)
  })

  it('should clear temporaries if validation succeeds', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, request } = makeSut()

    await sut.handle(request)

    expect(fakeUser.temporary.activationCode).toBeNull()
    expect(fakeUser.temporary.activationCodeExpiration).toBeNull()
  })

  it('should call updateUser with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, sut, request, userDbRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser, {
      'logs.updatedAt': new Date(Date.now()),
      'settings.accountActivated': fakeUser.settings.accountActivated,
      'temporary.activationCode': fakeUser.temporary.activationCode,
      'temporary.activationCodeExpiration': fakeUser.temporary.activationCode
    })
  })
})
