import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import { makeSut } from './verify-access-token-sut'

describe('VerifyAccessToken', () => {
  it('Should return TokenMissingError if there is no access token', async () => {
    const { sut, httpHelper } = makeSut()

    const response = await sut.handle({})

    expect(response).toEqual(httpHelper.unauthorized(new TokenMissingError()))
  })

  it('Should call jwtAccessToken.decode with token', async () => {
    const { sut, jwtAccessToken, request } = makeSut()

    const unauthorizedSpy = jest.spyOn(jwtAccessToken, 'decode')

    await sut.handle(request)

    expect(unauthorizedSpy).toHaveBeenCalledWith(request.accessToken)
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

  it('Should return ok if succeds', async () => {
    const { sut, fakeUser, httpHelper, jwtAccessToken, request } = makeSut()
    jest
      .spyOn(jwtAccessToken, 'decode')
      .mockReturnValueOnce(
        Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() })
      )

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ refreshToken: request.refreshToken, accessToken: 'any_token' }))
  })
})
