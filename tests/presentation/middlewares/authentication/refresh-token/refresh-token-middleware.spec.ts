import { TokenMissingError } from '@/application/usecases/errors'
import { makeSut } from './refresh-token-middleware-sut'

describe('RefreshTokenMiddleware', () => {
  it('Should return unauthorized if there is no token ', async () => {
    const { sut, httpHelper } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('Should call decodeId with correct token', async () => {
    const { sut, decoder, request } = makeSut()
    const decodeIdSpy = jest.spyOn(decoder, 'decodeId')

    await sut.handle(request)

    expect(decodeIdSpy).toHaveBeenCalledWith(request.token)
  })

  it('Should call findRefreshTokenByUserId with correct user id', async () => {
    const { sut, refreshTokenDbRepositoryStub, request } = makeSut()
    const findRefreshTokenByUserIdSpy = jest.spyOn(
      refreshTokenDbRepositoryStub,
      'findRefreshTokenByUserId'
    )

    await sut.handle(request)

    expect(findRefreshTokenByUserIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should call saveRefreshToken with correct user id if there is no refresh token', async () => {
    const { sut, refreshTokenDbRepositoryStub, request } = makeSut()
    jest
      .spyOn(refreshTokenDbRepositoryStub, 'findRefreshTokenByUserId')
      .mockReturnValueOnce(Promise.resolve(undefined))
    const saveRefreshTokenSpy = jest.spyOn(refreshTokenDbRepositoryStub, 'saveRefreshToken')

    await sut.handle(request)

    expect(saveRefreshTokenSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should call saveRefreshToken with correct user id if refresh token has expired', async () => {
    const { sut, fakeRefreshToken, refreshTokenDbRepositoryStub, request } = makeSut()
    fakeRefreshToken.expiresIn = new Date(Date.now() - 1000)

    jest
      .spyOn(refreshTokenDbRepositoryStub, 'findRefreshTokenByUserId')
      .mockReturnValueOnce(Promise.resolve(fakeRefreshToken))

    const saveRefreshTokenSpy = jest.spyOn(refreshTokenDbRepositoryStub, 'saveRefreshToken')

    await sut.handle(request)

    expect(saveRefreshTokenSpy).toHaveBeenCalledWith('any_id')
  })
})
