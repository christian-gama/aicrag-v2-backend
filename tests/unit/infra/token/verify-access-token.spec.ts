import { IUser } from '@/domain'
import { DecoderProtocol } from '@/domain/cryptography'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

import { TokenMissingError, InvalidTokenError } from '@/application/errors'

import { VerifyAccessToken } from '@/infra/token/verify-access-token'

import { makeFakeUser, makeDecoderStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  accessTokenDecoderStub: DecoderProtocol
  sut: VerifyAccessToken
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accessTokenDecoderStub = makeDecoderStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyAccessToken(accessTokenDecoderStub, userDbRepositoryStub)

  return { accessTokenDecoderStub, fakeUser, sut, userDbRepositoryStub }
}

describe('verifyAccessToken', () => {
  it('should return TokenMissingError if there is no token', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const refreshToken = undefined

    const response = await sut.verify(refreshToken)

    expect(response).toStrictEqual(new TokenMissingError())
  })

  it('should call accessTokenDecoder.decode with correct token', async () => {
    expect.hasAssertions()

    const { accessTokenDecoderStub, sut } = makeSut()
    const unauthorizedSpy = jest.spyOn(accessTokenDecoderStub, 'decode')

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

  it('should return error if decode fails', async () => {
    expect.hasAssertions()

    const { sut, accessTokenDecoderStub } = makeSut()
    jest.spyOn(accessTokenDecoderStub, 'decode').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(new Error())
  })

  it('should return InvalidTokenError if there is no user', async () => {
    expect.hasAssertions()

    const { sut, userDbRepositoryStub } = makeSut()
    jest.spyOn(userDbRepositoryStub, 'findUserById').mockReturnValueOnce(Promise.resolve(undefined))

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(new InvalidTokenError())
  })

  it('should return a user if succeeds', async () => {
    expect.hasAssertions()

    const { accessTokenDecoderStub, fakeUser, sut } = makeSut()
    jest
      .spyOn(accessTokenDecoderStub, 'decode')
      .mockReturnValueOnce(
        Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() })
      )

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(fakeUser)
  })
})
