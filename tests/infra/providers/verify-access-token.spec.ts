import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import { makeSut } from './verify-access-token-sut'

describe('VerifyRefreshToken', () => {
  it('Should return TokenMissingError if there is no token', async () => {
    const { sut } = makeSut()
    const refreshToken = undefined

    const response = await sut.verify(refreshToken)

    expect(response).toEqual(new TokenMissingError())
  })

  it('Should call jwtRefreshToken.decode with token', async () => {
    const { sut, jwtAccessTokenStub } = makeSut()

    const unauthorizedSpy = jest.spyOn(jwtAccessTokenStub, 'decode')

    await sut.verify('any_token')

    expect(unauthorizedSpy).toHaveBeenCalledWith('any_token')
  })

  it('Should call userDbRepository.findUserById with correct user id', async () => {
    const { sut, userDbRepositoryStub } = makeSut()

    const findUserByIdSpy = jest.spyOn(userDbRepositoryStub, 'findUserById')

    await sut.verify('any_token')

    expect(findUserByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return InvalidTokenError if there is no user', async () => {
    const { sut, userDbRepositoryStub } = makeSut()

    jest.spyOn(userDbRepositoryStub, 'findUserById').mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.verify('any_token')

    expect(response).toEqual(new InvalidTokenError())
  })
  it('Should return a user if succeds', async () => {
    const { sut, fakeUser, jwtAccessTokenStub } = makeSut()
    jest
      .spyOn(jwtAccessTokenStub, 'decode')
      .mockReturnValueOnce(
        Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() })
      )

    const response = await sut.verify('any_token')

    expect(response).toEqual(fakeUser)
  })
})
