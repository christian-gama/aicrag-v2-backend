import { makeSut } from './access-token-sut'

describe('AccessToken', () => {
  it('Should call verify with token', async () => {
    const { sut, request, verifyAccessTokenStub } = makeSut()

    const verifySpy = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith(request.accessToken)
  })

  it('Should return unauthorized if response is instance of Error', async () => {
    const { sut, request, httpHelper, verifyAccessTokenStub } = makeSut()

    jest.spyOn(verifyAccessTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new Error()))
  })

  it('Should return ok if succeds', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(
      httpHelper.ok({ accessToken: 'any_token' })
    )
  })
})
