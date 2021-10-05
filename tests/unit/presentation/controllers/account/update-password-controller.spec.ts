import { IUser } from '@/domain'
import { HasherProtocol } from '@/domain/cryptography'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { UpdatePasswordController } from '@/presentation/controllers/account'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakePublicUser,
  makeFakeUser,
  makeFilterUserDataStub,
  makeGenerateTokenStub,
  makeHasherStub,
  makeUserDbRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

import MockDate from 'mockdate'

interface SutTypes {
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  generateAccessTokenStub: GenerateTokenProtocol
  generateRefreshTokenStub: GenerateTokenProtocol
  hasherStub: HasherProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdatePasswordController
  updatePasswordValidatorStub: ValidatorProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
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
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new UpdatePasswordController(
    filterUserDataStub,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    hasherStub,
    httpHelper,
    updatePasswordValidatorStub,
    userDbRepositoryStub
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
    userDbRepositoryStub
  }
}

describe('updatePasswordController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call validate with correct credentials', async () => {
    expect.hasAssertions()

    const { request, sut, updatePasswordValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(updatePasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, updatePasswordValidatorStub } = makeSut()
    jest
      .spyOn(updatePasswordValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
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

    const { request, sut, userDbRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(request.user, {
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

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', refreshToken: 'any_token', user: makeFakePublicUser(fakeUser) })
    )
  })
})
