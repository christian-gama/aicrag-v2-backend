import { TokenMissingError } from '@/application/usecases/errors'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'
import { makeSut } from './refresh-token-middleware-sut'

describe('RefreshTokenMiddleware', () => {
  it('Should return unauthorized if there is no refreshToken on cookies', async () => {
    const { sut, httpHelper } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('Should return unauthorized if there is no refreshToken on database', async () => {
    const { sut, httpHelper, refreshTokenDbRepositoryStub } = makeSut()
    jest.spyOn(refreshTokenDbRepositoryStub, 'findRefreshTokenById').mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('Should call jwtRefreshToken.decode with correct token', async () => {
    const { sut, jwtRefreshToken, request } = makeSut()
    const decodeSpy = jest.spyOn(jwtRefreshToken, 'decode')

    await sut.handle(request)

    expect(decodeSpy).toHaveBeenCalledWith(request.refreshToken)
  })

  it('Should call jwtAccessToken.encrypt with correct token', async () => {
    const { sut, jwtAccessToken, refreshTokenDbRepositoryStub, request } = makeSut()
    const fakeRefreshToken = makeFakeRefreshToken()
    jest.spyOn(refreshTokenDbRepositoryStub, 'findRefreshTokenById').mockReturnValueOnce(Promise.resolve(fakeRefreshToken))
    const encryptSpy = jest.spyOn(jwtAccessToken, 'encrypt')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith('id', fakeRefreshToken.userId)
  })

  it('Should call findRefreshTokenById with correct user id', async () => {
    const { sut, refreshTokenDbRepositoryStub, request } = makeSut()
    const findRefreshTokenByIdSpy = jest.spyOn(
      refreshTokenDbRepositoryStub,
      'findRefreshTokenById'
    )

    await sut.handle(request)

    expect(findRefreshTokenByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should call deleteRefreshTokenById with correct id if refresh token has expired', async () => {
    const { sut, fakeRefreshToken, refreshTokenDbRepositoryStub, request } = makeSut()
    fakeRefreshToken.expiresIn = new Date(Date.now() - 1000)

    jest
      .spyOn(refreshTokenDbRepositoryStub, 'findRefreshTokenById')
      .mockReturnValueOnce(Promise.resolve(fakeRefreshToken))

    const saveRefreshTokenSpy = jest.spyOn(refreshTokenDbRepositoryStub, 'deleteRefreshTokenById')

    await sut.handle(request)

    expect(saveRefreshTokenSpy).toHaveBeenCalledWith(fakeRefreshToken.userId)
  })

  it('Should return a user id and an access token on success', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ refreshToken: 'any_token', accessToken: 'any_token' }))
  })
})
