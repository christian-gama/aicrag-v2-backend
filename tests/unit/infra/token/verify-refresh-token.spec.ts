import { IUser } from '@/domain'
import { IDecoder } from '@/domain/cryptography'
import { IRefreshToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'

import { InvalidTokenError, TokenMissingError } from '@/application/errors'

import { VerifyRefreshToken } from '@/infra/token/verify-refresh-token'

import { makeFakeRefreshToken, makeFakeUser, makeDecoderStub, makeUserRepositoryStub } from '@/tests/__mocks__'
interface SutTypes {
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  refreshTokenDecoderStub: IDecoder
  sut: VerifyRefreshToken
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const refreshTokenDecoderStub = makeDecoderStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new VerifyRefreshToken(refreshTokenDecoderStub, userRepositoryStub)

  return { fakeRefreshToken, fakeUser, refreshTokenDecoderStub, sut, userRepositoryStub }
}

describe('verifyRefreshToken', () => {
  it('should return TokenMissingError if there is no refresh token', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const refreshToken = undefined

    const result = await sut.verify(refreshToken)

    expect(result).toStrictEqual(new TokenMissingError())
  })

  it('should call refreshTokenDecoder.decode with correct token', async () => {
    expect.hasAssertions()

    const { refreshTokenDecoderStub, sut } = makeSut()
    const unauthorizedSpy = jest.spyOn(refreshTokenDecoderStub, 'decode')

    await sut.verify('any_token')

    expect(unauthorizedSpy).toHaveBeenCalledWith('any_token')
  })

  it('should call userRepository.findUserById with correct user id', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    const findUserByIdSpy = jest.spyOn(userRepositoryStub, 'findUserById')

    await sut.verify('any_token')

    expect(findUserByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return InvalidTokenError if there is no user', async () => {
    expect.hasAssertions()

    const { sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findUserById').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.verify('any_token')

    expect(result).toStrictEqual(new InvalidTokenError())
  })

  it('should return an error if decode returns an error', async () => {
    expect.hasAssertions()

    const { sut, refreshTokenDecoderStub } = makeSut()
    jest.spyOn(refreshTokenDecoderStub, 'decode').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.verify('any_token')

    expect(result).toStrictEqual(new Error())
  })

  it("should return InvalidTokenError if token version is different from user's token version", async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const result = await sut.verify('any_token')

    expect(result).toStrictEqual(new InvalidTokenError())
  })

  it('should return a user if succeeds', async () => {
    expect.hasAssertions()

    const { fakeUser, refreshTokenDecoderStub, sut } = makeSut()
    jest
      .spyOn(refreshTokenDecoderStub, 'decode')
      .mockReturnValueOnce(Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() }))

    const result = await sut.verify('any_token')

    expect(result).toStrictEqual(fakeUser)
  })
})
