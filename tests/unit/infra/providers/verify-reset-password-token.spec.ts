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

  return { sut, fakeUser, jwtAccessTokenStub, userDbRepositoryStub }
}

describe('VerifyResetPasswordToken', () => {
  it('Should return TokenMissingError if there is no token', async () => {
    const { sut } = makeSut()
    const refreshToken = undefined

    const response = await sut.verify(refreshToken)

    expect(response).toEqual(new TokenMissingError())
  })

  it('Should call jwtAccessToken.decode with correct token', async () => {
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

  it("Should return InvalidTokenError if user's token is different from param token", async () => {
    const { sut, fakeUser, userDbRepositoryStub } = makeSut()
    jest.spyOn(userDbRepositoryStub, 'findUserById').mockImplementation(async () => {
      fakeUser.temporary.resetPasswordToken = 'different_token'

      return fakeUser
    })

    const response = await sut.verify('any_token')

    expect(response).toEqual(new InvalidTokenError())
  })

  it('Should return InvalidTokenError if decode throws', async () => {
    const { sut, jwtAccessTokenStub } = makeSut()
    jest.spyOn(jwtAccessTokenStub, 'decode').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = await sut.verify('any_token')

    expect(promise).toEqual(new InvalidTokenError())
  })

  it('Should return a user if succeds', async () => {
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

    expect(response).toEqual(fakeUser)
  })
})
