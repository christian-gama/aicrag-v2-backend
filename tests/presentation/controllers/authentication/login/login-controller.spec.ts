import {
  InactiveAccountError,
  InvalidParamError,
  MissingParamError,
  MustLogoutError,
  UserCredentialError
} from '@/application/usecases/errors'
import { makeSut } from './login-controller-sut'

describe('LoginController', () => {
  it('Should call validate with correct values', async () => {
    const { sut, credentialsValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(credentialsValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call unauthorized with the correct value', async () => {
    const { sut, httpHelper, credentialsValidatorStub, request } = makeSut()

    const error = new UserCredentialError()
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    const unauthorizedSpy = jest.spyOn(httpHelper, 'unauthorized')

    await sut.handle(request)

    expect(unauthorizedSpy).toHaveBeenCalledWith(error)
  })

  it('Should call badRequest with the correct value if it is an InvalidParamError', async () => {
    const { sut, credentialsValidatorStub, httpHelper, request } = makeSut()

    const error = new InvalidParamError('email')
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('Should call badRequest with the correct value if it is a MissingParamError', async () => {
    const { sut, credentialsValidatorStub, httpHelper, request } = makeSut()

    const error = new MissingParamError('email')
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    const badRequestSpy = jest.spyOn(httpHelper, 'badRequest')

    await sut.handle(request)

    expect(badRequestSpy).toHaveBeenCalledWith(error)
  })

  it('Should return ok with accessToken only if account is not activated with the correct value if it is an InactiveAccountError', async () => {
    const { sut, credentialsValidatorStub, httpHelper, request } = makeSut()

    const error = new InactiveAccountError()
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ message: error.message, accessToken: 'any_token' }))
  })

  it('Should call generate with correct user', async () => {
    const { sut, fakeUser, generateAccessTokenStub, request } = makeSut()

    const generateSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call findUserByEmail with the correct value', async () => {
    const { sut, userDbRepositoryStub, request } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should call generateAccessToken.generate with correct values', async () => {
    const { sut, fakeUser, generateAccessTokenStub, request } = makeSut()
    const encryptSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call generateRefreshToken.generate with correct values', async () => {
    const { sut, fakeUser, generateRefreshTokenStub, request } = makeSut()
    const encryptSpy = jest.spyOn(generateRefreshTokenStub, 'generate')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should call the filter with correct user', async () => {
    const { sut, fakeUser, filterUserDataStub, request } = makeSut()
    const filterSpy = jest.spyOn(filterUserDataStub, 'filter')

    await sut.handle(request)

    expect(filterSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should return badRequest if user is already logged in', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(new MustLogoutError()))
  })

  it('Should call ok with the correct value', async () => {
    const { sut, fakePublicUser, httpHelper, request } = makeSut()
    const okSpy = jest.spyOn(httpHelper, 'ok')

    await sut.handle(request)

    expect(okSpy).toHaveBeenCalledWith({
      user: fakePublicUser,
      refreshToken: 'any_token',
      accessToken: 'any_token'
    })
  })

  it('Should return ok if validation succeds', async () => {
    const { sut, fakePublicUser, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(
      httpHelper.ok({ user: fakePublicUser, refreshToken: 'any_token', accessToken: 'any_token' })
    )
  })
})