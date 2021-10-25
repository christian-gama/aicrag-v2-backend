import { IUser } from '@/domain'
import { IHasher } from '@/domain/cryptography'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { UpdatePasswordController } from '@/presentation/controllers/account'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakePublicUser,
  makeFakeUser,
  makeFilterUserDataStub,
  makeGenerateTokenStub,
  makeHasherStub,
  makeUserRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

import MockDate from 'mockdate'

interface SutTypes {
  fakeUser: IUser
  filterUserDataStub: IFilterUserData
  generateAccessTokenStub: IGenerateToken
  generateRefreshTokenStub: IGenerateToken
  hasherStub: IHasher
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdatePasswordController
  updatePasswordValidatorStub: IValidator
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const generateAccessTokenStub = makeGenerateTokenStub()
  const generateRefreshTokenStub = makeGenerateTokenStub()
  const hasherStub = makeHasherStub()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = {
    body: {
      currentPassword: fakeUser.personal.password,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    },
    user: fakeUser
  }
  const updatePasswordValidatorStub = makeValidatorStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new UpdatePasswordController(
    filterUserDataStub,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    hasherStub,
    httpHelper,
    updatePasswordValidatorStub,
    userRepositoryStub
  )

  return {
    fakeUser,
    filterUserDataStub,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    hasherStub,
    httpHelper,
    request,
    sut,
    updatePasswordValidatorStub,
    userRepositoryStub
  }
}

describe('updatePasswordController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call validate with correct data', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, updatePasswordValidatorStub } = makeSut()
    const data = Object.assign({ user: fakeUser }, request.body)
    const validateSpy = jest.spyOn(updatePasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(data)
  })

  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, updatePasswordValidatorStub } = makeSut()
    jest.spyOn(updatePasswordValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call hash with correct password', async () => {
    expect.hasAssertions()

    const { hasherStub, request, sut } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.handle(request)

    expect(hashSpy).toHaveBeenCalledWith(request.body.password)
  })

  it('should call updateUser with correct password', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.password': 'hashed_value'
    })
  })

  it('should call filter with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, filterUserDataStub, request, sut } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call generate from access token with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, generateAccessTokenStub, request, sut } = makeSut()
    const generateSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call generate with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, generateRefreshTokenStub, request, sut } = makeSut()
    const generateSpy = jest.spyOn(generateRefreshTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return ok if succeeds', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        accessToken: 'any_token',
        refreshToken: 'any_token',
        user: makeFakePublicUser(fakeUser)
      })
    )
  })
})
