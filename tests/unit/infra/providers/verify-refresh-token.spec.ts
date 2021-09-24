import { IUser } from '@/domain'

import { DecoderProtocol } from '@/application/protocols/cryptography'
import { IRefreshToken } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { InvalidTokenError, TokenMissingError } from '@/application/usecases/errors'

import { VerifyRefreshToken } from '@/infra/providers/token/verify-refresh-token'

import { makeFakeRefreshToken, makeFakeUser, makeDecoderStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'
interface SutTypes {
  sut: VerifyRefreshToken
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  jwtRefreshTokenStub: DecoderProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const jwtRefreshTokenStub = makeDecoderStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyRefreshToken(jwtRefreshTokenStub, userDbRepositoryStub)

  return { sut, fakeRefreshToken, fakeUser, jwtRefreshTokenStub, userDbRepositoryStub }
}

describe('VerifyRefreshToken', () => {
  it('Should return TokenMissingError if there is no refresh token', async () => {
    const { sut } = makeSut()
    const refreshToken = undefined

    const response = await sut.verify(refreshToken)

    expect(response).toEqual(new TokenMissingError())
  })

  it('Should call jwtRefreshToken.decode with correct token', async () => {
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
