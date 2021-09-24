import { DecoderProtocol } from '@/application/protocols/cryptography'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { TokenMissingError, InvalidTokenError } from '@/application/usecases/errors'
import { IUser } from '@/domain'
import { VerifyAccessToken } from '@/infra/providers/token/verify-access-token'
import { makeFakeUser, makeDecoderStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: VerifyAccessToken
  fakeUser: IUser
  jwtAccessTokenStub: DecoderProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const jwtAccessTokenStub = makeDecoderStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyAccessToken(jwtAccessTokenStub, userDbRepositoryStub)

  return { sut, fakeUser, jwtAccessTokenStub, userDbRepositoryStub }
}

describe('VerifyAccessToken', () => {
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
