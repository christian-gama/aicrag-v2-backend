import { makeSut } from './refresh-token-sut'

describe('RefreshToken', () => {
  it('Should call verify with token', async () => {
    const { sut, request, verifyRefreshTokenStub } = makeSut()

    const verifySpy = jest.spyOn(verifyRefreshTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.refreshToken)
  })

  it('Should return unauthorized if response is instance of Error', async () => {
    const { sut, request, httpHelper, verifyRefreshTokenStub } = makeSut()

    jest.spyOn(verifyRefreshTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new Error()))
  })

  it('Should call jwtAccessToken with correct values', async () => {
    const { sut, fakeUser, jwtAccessToken, request, verifyRefreshTokenStub } = makeSut()
    jest
      .spyOn(verifyRefreshTokenStub, 'verify')
      .mockReturnValueOnce(
        Promise.resolve(fakeUser)
      )

    const encryptSpy = jest.spyOn(jwtAccessToken, 'encrypt')

    await sut.handle(request)

    expect(encryptSpy).toHaveBeenCalledWith({ userId: fakeUser.personal.id })
  })

  it('Should return ok if succeds', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ refreshToken: request.refreshToken, accessToken: 'any_token' }))
  })
})
