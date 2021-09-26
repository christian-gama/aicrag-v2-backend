import { IUser } from '@/domain'

import { DecoderProtocol } from '@/application/protocols/cryptography'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { TokenMissingError, InvalidTokenError } from '@/application/usecases/errors'

import { VerifyResetPasswordToken } from '@/infra/providers/token'

import { makeFakeUser, makeDecoderStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: VerifyResetPasswordToken
  fakeUser: IUser
  jwtAccessTokenStub: DecoderProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const jwtAccessTokenStub = makeDecoderStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyResetPasswordToken(jwtAccessTokenStub, userDbRepositoryStub)

  return { fakeUser, jwtAccessTokenStub, sut, userDbRepositoryStub }
}

describe('verifyResetPasswordToken', () => {
  it('should return TokenMissingError if there is no token', async () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const refreshToken = undefined

    const response = await sut.verify(refreshToken)

    expect(response).toStrictEqual(new TokenMissingError())
  })

  it('should call jwtAccessToken.decode with correct token', async () => {
    expect.hasAssertions()

    const { jwtAccessTokenStub, sut } = makeSut()
    const unauthorizedSpy = jest.spyOn(jwtAccessTokenStub, 'decode')

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

  it('should return a user if succeds', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, jwtAccessTokenStub, userDbRepositoryStub } = makeSut()
    jest
      .spyOn(jwtAccessTokenStub, 'decode')
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
