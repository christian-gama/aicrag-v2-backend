import { IUser } from '@/domain'

import { DecoderProtocol } from '@/application/protocols/cryptography'
import { IRefreshToken } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'

import { VerifyRefreshToken } from '@/infra/providers/token/verify-refresh-token'

import { makeFakeRefreshToken, makeFakeUser, makeDecoderStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'
interface SutTypes {
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  jwtRefreshTokenStub: DecoderProtocol
  sut: VerifyRefreshToken
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const jwtRefreshTokenStub = makeDecoderStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyRefreshToken(jwtRefreshTokenStub, userDbRepositoryStub)

  return { fakeRefreshToken, fakeUser, jwtRefreshTokenStub, sut, userDbRepositoryStub }
}

describe('verifyRefreshToken', () => {
  it('should return TokenMissingError if there is no refresh token', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const refreshToken = undefined

    const response = await sut.verify(refreshToken)

    expect(response).toStrictEqual(new TokenMissingError())
  })

  it('should call jwtRefreshToken.decode with correct token', async () => {
    expect.hasAssertions()

    const { jwtRefreshTokenStub, sut } = makeSut()
    const unauthorizedSpy = jest.spyOn(jwtRefreshTokenStub, 'decode')

    await sut.verify('any_token')

    expect(unauthorizedSpy).toHaveBeenCalledWith('any_token')
  })

  it('should call userDbRepository.findUserById with correct user id', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    const findUserByIdSpy = jest.spyOn(userDbRepositoryStub, 'findUserById')

    await sut.verify('any_token')

    expect(findUserByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return InvalidTokenError if there is no user', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    jest.spyOn(userDbRepositoryStub, 'findUserById').mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(new InvalidTokenError())
  })

  it('should return an error if decode returns an error', async () => {
    expect.hasAssertions()

    const { sut, jwtRefreshTokenStub } = makeSut()
    jest.spyOn(jwtRefreshTokenStub, 'decode').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(new Error())
  })

  it("should return InvalidTokenError if token version is different from user's token version", async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(new InvalidTokenError())
  })

  it('should return a user if succeds', async () => {
    expect.hasAssertions()

    const { fakeUser, jwtRefreshTokenStub, sut } = makeSut()
    jest
      .spyOn(jwtRefreshTokenStub, 'decode')
      .mockReturnValueOnce(
        Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() })
      )

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(fakeUser)
  })
})
