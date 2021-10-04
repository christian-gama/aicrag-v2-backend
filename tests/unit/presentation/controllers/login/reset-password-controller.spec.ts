import { IUser, IPublicUser } from '@/domain'
import { HasherProtocol } from '@/domain/cryptography'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol, VerifyTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLogoutError, InvalidTokenError } from '@/application/errors'

import { ResetPasswordController } from '@/presentation/controllers/login/reset-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import {
  makeFakeUser,
  makeFilterUserDataStub,
  makeFakePublicUser,
  makeGenerateTokenStub,
  makeHasherStub,
  makeValidatorStub,
  makeUserDbRepositoryStub,
  makeVerifyTokenStub
} from '@/tests/__mocks__'

import { makeHttpHelper } from '@/factories/helpers'
import MockDate from 'mockdate'

interface SutTypes {
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  filteredUser: IPublicUser
  generateRefreshTokenStub: GenerateTokenProtocol
  hasherStub: HasherProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  resetPasswordValidatorStub: ValidatorProtocol
  sut: ResetPasswordController
  userDbRepositoryStub: UserDbRepositoryProtocol
  verifyResetPasswordTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const filteredUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const generateRefreshTokenStub = makeGenerateTokenStub()
  const hasherStub = makeHasherStub()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = {
    body: { password: 'new_password', passwordConfirmation: 'new_password' },
    cookies: { accessToken: 'any_token' }
  }
  const resetPasswordValidatorStub = makeValidatorStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const verifyResetPasswordTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new ResetPasswordController(
    filterUserDataStub,
    generateRefreshTokenStub,
    hasherStub,
    httpHelper,
    resetPasswordValidatorStub,
    userDbRepositoryStub,
    verifyResetPasswordTokenStub
  )

  return {
    fakeUser,
    filterUserDataStub,
    filteredUser,
    generateRefreshTokenStub,
    hasherStub,
    httpHelper,
    request,
    resetPasswordValidatorStub,
    sut,
    userDbRepositoryStub,
    verifyResetPasswordTokenStub
  }
}

describe('resetPasswordController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return forbidden if user is logged in', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('should call verify with correct token', async () => {
    expect.hasAssertions()

    const { sut, request, verifyResetPasswordTokenStub } = makeSut()
    const verifyStub = jest.spyOn(verifyResetPasswordTokenStub, 'verify')

    await sut.handle(request)

    expect(verifyStub).toHaveBeenCalledWith(request.cookies?.accessToken)
  })

  it('should return unauthorized if verify fails', async () => {
    expect.hasAssertions()

    const { sut, httpHelper, request, verifyResetPasswordTokenStub } = makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('should call updateUser with correct values', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userDbRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.password': 'hashed_value',
      'temporary.resetPasswordToken': null
    })
  })

  it('should call validate with correct credentials', async () => {
    expect.hasAssertions()

    const { sut, request, resetPasswordValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(resetPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { sut, httpHelper, request, resetPasswordValidatorStub } = makeSut()
    jest
      .spyOn(resetPasswordValidatorStub, 'validate')
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

  it('should call generate with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, generateRefreshTokenStub, request, sut } = makeSut()
    const generateSpy = jest.spyOn(generateRefreshTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call filter with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, filterUserDataStub, request, sut } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return ok if succeeds', async () => {
    expect.hasAssertions()

    const { filteredUser, filterUserDataStub, httpHelper, request, sut } = makeSut()
    jest.spyOn(filterUserDataStub, 'filter').mockReturnValueOnce(filteredUser)

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ refreshToken: 'any_token', user: filteredUser }))
  })
})
