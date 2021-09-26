import { IUser, IPublicUser } from '@/domain'

import { HasherProtocol } from '@/application/protocols/cryptography'
import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol, VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MustLogoutError, InvalidTokenError } from '@/application/usecases/errors'

import { ResetPasswordController } from '@/presentation/controllers/login/reset-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

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

  it('should return ok if succeds', async () => {
    expect.hasAssertions()

    const { filteredUser, filterUserDataStub, httpHelper, request, sut } = makeSut()
    jest.spyOn(filterUserDataStub, 'filter').mockReturnValueOnce(filteredUser)

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ refreshToken: 'any_token', user: filteredUser }))
  })
})
