import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'
import { makeSut } from './verify-refresh-token-sut'

describe('VerifyRefreshToken', () => {
  it('Should return TokenMissingError if there is no refresh token', async () => {
    const { sut } = makeSut()
    const refreshToken = undefined

    const response = await sut.verify(refreshToken)

    expect(response).toEqual(new TokenMissingError())
  })

  it('Should call jwtRefreshToken.decode with token', async () => {
    const { sut, jwtRefreshTokenStub } = makeSut()

    const unauthorizedSpy = jest.spyOn(jwtRefreshTokenStub, 'decode')

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

  it("Should return InvalidTokenError if token version is different from user's token version", async () => {
    const { sut } = makeSut()

    const response = await sut.verify('any_token')

    expect(response).toEqual(new InvalidTokenError())
  })

  it('Should return a user if succeds', async () => {
    const { sut, fakeUser, jwtRefreshTokenStub } = makeSut()
    jest
      .spyOn(jwtRefreshTokenStub, 'decode')
      .mockReturnValueOnce(
        Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() })
      )

    const response = await sut.verify('any_token')

    expect(response).toEqual(fakeUser)
  })
})
