import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import { makeSut } from './verify-refresh-token-sut'

describe('VerifyRefreshToken', () => {
  it('Should return TokenMissingError if there is no refresh token', async () => {
    const { sut, httpHelper } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('Should call jwtRefreshToken.decode with token', async () => {
    const { sut, jwtRefreshToken, request } = makeSut()

    const unauthorizedSpy = jest.spyOn(jwtRefreshToken, 'decode')

    await sut.handle(request)

    expect(unauthorizedSpy).toHaveBeenCalledWith(request.refreshToken)
  })

  it('Should call userDbRepository.findUserById with correct user id', async () => {
    const { sut, request, userDbRepositoryStub } = makeSut()

    const findUserByIdSpy = jest.spyOn(userDbRepositoryStub, 'findUserById')

    await sut.handle(request)

    expect(findUserByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return InvalidTokenError if there is no user', async () => {
    const { sut, request, httpHelper, userDbRepositoryStub } = makeSut()

    jest.spyOn(userDbRepositoryStub, 'findUserById').mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it("Should return InvalidTokenError if token version is different from user's token version", async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('Should call jwtAccessToken with correct values', async () => {
    const { sut, fakeUser, jwtRefreshToken, jwtAccessToken, request } = makeSut()
    jest
      .spyOn(jwtRefreshToken, 'decode')
      .mockReturnValueOnce(
        Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() })
      )

    const encryptSpy = jest.spyOn(jwtAccessToken, 'encrypt')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith({ userId: fakeUser.personal.id })
  })

  it('Should return ok if succeds', async () => {
    const { sut, fakeUser, httpHelper, jwtRefreshToken, request } = makeSut()
    jest
      .spyOn(jwtRefreshToken, 'decode')
      .mockReturnValueOnce(
        Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() })
      )

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ refreshToken: request.refreshToken, accessToken: 'any_token' }))
  })
})
