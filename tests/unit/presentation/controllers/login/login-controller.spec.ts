import { IPublicUser, IUser } from '@/domain'

import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { UserCredentialError, InvalidParamError, MissingParamError, InactiveAccountError, MustLogoutError } from '@/application/usecases/errors'

import { LoginController } from '@/presentation/controllers/login'
import { HttpHelper } from '@/presentation/helpers/http/http-helper'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeValidatorStub, makeFakeUser, makeFakePublicUser, makeFilterUserDataStub, makeGenerateTokenStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  credentialsValidatorStub: ValidatorProtocol
  fakePublicUser: IPublicUser
  fakeUser: IUser
  filterUserDataStub: FilterUserDataProtocol
  generateAccessTokenStub: GenerateTokenProtocol
  generateRefreshTokenStub: GenerateTokenProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: LoginController
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const credentialsValidatorStub = makeValidatorStub()
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const generateAccessTokenStub = makeGenerateTokenStub()
  const generateRefreshTokenStub = makeGenerateTokenStub()
  const httpHelper = new HttpHelper()
  const request = { body: { email: fakeUser.personal.email, password: fakeUser.personal.password } }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new LoginController(
    credentialsValidatorStub,
    filterUserDataStub,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    httpHelper,
    userDbRepositoryStub
  )

  return {
    credentialsValidatorStub,
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

describe('loginController', () => {
  it('should call validate with correct values', async () => {
    expect.hasAssertions()

    const { credentialsValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(credentialsValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should call unauthorized with the correct value', async () => {
    expect.hasAssertions()

    const { credentialsValidatorStub, httpHelper, request, sut } = makeSut()
    const error = new UserCredentialError()
    const unauthorizedSpy = jest.spyOn(httpHelper, 'unauthorized')
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    await sut.handle(request)

    expect(unauthorizedSpy).toHaveBeenCalledWith(error)
  })

  it('should call badRequest with the correct value if it is an InvalidParamError', async () => {
    expect.hasAssertions()

    const { credentialsValidatorStub, httpHelper, request, sut } = makeSut()
    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')
    const error = new InvalidParamError('email')
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('should call badRequest with the correct value if it is a MissingParamError', async () => {
    expect.hasAssertions()

    const { credentialsValidatorStub, httpHelper, request, sut } = makeSut()
    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')
    const error = new MissingParamError('email')
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('should return ok with accessToken only if account is not activated with the correct value if it is an InactiveAccountError', async () => {
    expect.hasAssertions()

    const { credentialsValidatorStub, httpHelper, request, sut } = makeSut()
    const error = new InactiveAccountError()
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ accessToken: 'any_token', message: error.message }))
  })

  it('should call generate with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, generateAccessTokenStub, request, sut } = makeSut()
    const generateSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call findUserByEmail with the correct value', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should call generateAccessToken.generate with correct values', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, generateAccessTokenStub, request } = makeSut()
    const encryptSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call generateRefreshToken.generate with correct values', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, generateRefreshTokenStub, request } = makeSut()
    const encryptSpy = jest.spyOn(generateRefreshTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call the filter with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, filterUserDataStub, request, sut } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return forbidden if user is already logged in', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('should call ok with the correct value', async () => {
    expect.hasAssertions()

    const { fakePublicUser, httpHelper, request, sut } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({
      accessToken: 'any_token',
      refreshToken: 'any_token',
      user: fakePublicUser
    })
  })

  it('should return ok if validation succeds', async () => {
    expect.hasAssertions()

    const { fakePublicUser, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', refreshToken: 'any_token', user: fakePublicUser })
    )
  })
})
