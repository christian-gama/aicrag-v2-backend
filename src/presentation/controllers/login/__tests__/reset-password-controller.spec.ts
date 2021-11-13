import { IUser, IPublicUser } from '@/domain'
import { IHasher } from '@/domain/cryptography'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken, IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLogoutError, InvalidTokenError } from '@/application/errors'
import { ResetPasswordController } from '@/presentation/controllers/login/reset-password-controller'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import {
  makeFakeUser,
  makeFilterUserDataStub,
  makeFakePublicUser,
  makeGenerateTokenStub,
  makeHasherStub,
  makeValidatorStub,
  makeUserRepositoryStub,
  makeVerifyTokenStub
} from '@/tests/__mocks__'
import MockDate from 'mockdate'

interface SutTypes {
  fakeUser: IUser
  filterUserDataStub: IFilterUserData
  filteredUser: IPublicUser
  generateRefreshTokenStub: IGenerateToken
  hasherStub: IHasher
  httpHelper: IHttpHelper
  request: HttpRequest
  resetPasswordValidatorStub: IValidator
  sut: ResetPasswordController
  userRepositoryStub: IUserRepository
  verifyResetPasswordTokenStub: IVerifyToken
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
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const verifyResetPasswordTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new ResetPasswordController(
    filterUserDataStub,
    generateRefreshTokenStub,
    hasherStub,
    httpHelper,
    resetPasswordValidatorStub,
    userRepositoryStub,
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
    userRepositoryStub,
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
    const { fakeUser, httpHelper, request, sut } = makeSut()
    request.user = fakeUser

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('should call verify with correct token', async () => {
    const { sut, request, verifyResetPasswordTokenStub } = makeSut()
    const verifyStub = jest.spyOn(verifyResetPasswordTokenStub, 'verify')

    await sut.handle(request)

    expect(verifyStub).toHaveBeenCalledWith(request.cookies?.accessToken)
  })

  it('should return unauthorized if verify fails', async () => {
    const { sut, httpHelper, request, verifyResetPasswordTokenStub } = makeSut()
    jest.spyOn(verifyResetPasswordTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('should call updateById with correct values', async () => {
    const { fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updateByIdSpy = jest.spyOn(userRepositoryStub, 'updateById')

    await sut.handle(request)

    expect(updateByIdSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'logs.updatedAt': new Date(Date.now()),
      'personal.password': 'hashed_value',
      'temporary.resetPasswordToken': null
    })
  })

  it('should call validate with correct data', async () => {
    const { sut, request, resetPasswordValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(resetPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    const { sut, httpHelper, request, resetPasswordValidatorStub } = makeSut()
    jest.spyOn(resetPasswordValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call hash with correct password', async () => {
    const { hasherStub, request, sut } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.handle(request)

    expect(hashSpy).toHaveBeenCalledWith(request.body.password)
  })

  it('should call generate with correct user', async () => {
    const { fakeUser, generateRefreshTokenStub, request, sut } = makeSut()
    const generateSpy = jest.spyOn(generateRefreshTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call filter with correct user', async () => {
    const { fakeUser, filterUserDataStub, request, sut } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return ok if succeeds', async () => {
    const { filteredUser, filterUserDataStub, httpHelper, request, sut } = makeSut()
    jest.spyOn(filterUserDataStub, 'filter').mockReturnValueOnce(filteredUser)

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ refreshToken: 'any_token', user: filteredUser }))
  })
})
