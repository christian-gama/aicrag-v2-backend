import { IUser } from '@/domain'
import { DecoderProtocol } from '@/domain/cryptography'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

import { TokenMissingError, InvalidTokenError } from '@/application/errors'

import { VerifyResetPasswordToken } from '@/infra/token'

import { makeFakeUser, makeDecoderStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: VerifyResetPasswordToken
  fakeUser: IUser
  accessTokenDecoderStub: DecoderProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accessTokenDecoderStub = makeDecoderStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyResetPasswordToken(accessTokenDecoderStub, userDbRepositoryStub)

  return { accessTokenDecoderStub, fakeUser, sut, userDbRepositoryStub }
}

describe('verifyResetPasswordToken', () => {
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

  it('should return error if decode fails', async () => {
    expect.hasAssertions()

    const { sut, accessTokenDecoderStub } = makeSut()
    jest.spyOn(accessTokenDecoderStub, 'decode').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(new Error())
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
    jest.spyOn(userDbRepositoryStub, 'findUserById').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(new InvalidTokenError())
  })

  it("should return InvalidTokenError if user's token is different from param token", async () => {
    expect.hasAssertions()

    const { sut, fakeUser, userDbRepositoryStub } = makeSut()
    jest.spyOn(userDbRepositoryStub, 'findUserById').mockImplementation(async () => {
      fakeUser.temporary.resetPasswordToken = 'different_token'

      return fakeUser
    })

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(new InvalidTokenError())
  })

  it('should return a user if succeeds', async () => {
    expect.hasAssertions()

    const { accessTokenDecoderStub, fakeUser, sut, userDbRepositoryStub } = makeSut()
    jest
      .spyOn(accessTokenDecoderStub, 'decode')
      .mockReturnValueOnce(
        Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() })
      )
    jest.spyOn(userDbRepositoryStub, 'findUserById').mockImplementation(async () => {
      fakeUser.temporary.resetPasswordToken = 'any_token'

      return fakeUser
    })

    const response = await sut.verify('any_token')

    expect(response).toStrictEqual(fakeUser)
  })
})
