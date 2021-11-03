import { IUser } from '@/domain'
import { IDecoder } from '@/domain/cryptography'
import { IUserRepository } from '@/domain/repositories'
import { TokenMissingError, InvalidTokenError } from '@/application/errors'
import { VerifyResetPasswordToken } from '@/infra/token'
import { makeFakeUser, makeDecoderStub, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: VerifyResetPasswordToken
  fakeUser: IUser
  accessTokenDecoderStub: IDecoder
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accessTokenDecoderStub = makeDecoderStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new VerifyResetPasswordToken(accessTokenDecoderStub, userRepositoryStub)

  return { accessTokenDecoderStub, fakeUser, sut, userRepositoryStub }
}

describe('verifyResetPasswordToken', () => {
  it('should return TokenMissingError if there is no token', async () => {
    const { sut } = makeSut()
    const refreshToken = undefined

    const result = await sut.verify(refreshToken)

    expect(result).toStrictEqual(new TokenMissingError())
  })

  it('should call accessTokenDecoder.decode with correct token', async () => {
    const { accessTokenDecoderStub, sut } = makeSut()
    const unauthorizedSpy = jest.spyOn(accessTokenDecoderStub, 'decode')

    await sut.verify('any_token')

    expect(unauthorizedSpy).toHaveBeenCalledWith('any_token')
  })

  it('should return error if decode fails', async () => {
    const { sut, accessTokenDecoderStub } = makeSut()
    jest.spyOn(accessTokenDecoderStub, 'decode').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.verify('any_token')

    expect(result).toStrictEqual(new Error())
  })

  it('should call userRepository.findById with correct user id', async () => {
    const { sut, userRepositoryStub } = makeSut()
    const findUserByIdSpy = jest.spyOn(userRepositoryStub, 'findById')

    await sut.verify('any_token')

    expect(findUserByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('should return InvalidTokenError if there is no user', async () => {
    const { sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(Promise.resolve(null))

    const result = await sut.verify('any_token')

    expect(result).toStrictEqual(new InvalidTokenError())
  })

  it("should return InvalidTokenError if user's token is different from param token", async () => {
    const { sut, fakeUser, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findById').mockImplementation(async () => {
      fakeUser.temporary.resetPasswordToken = 'different_token'

      return fakeUser
    })

    const result = await sut.verify('any_token')

    expect(result).toStrictEqual(new InvalidTokenError())
  })

  it('should return a user if succeeds', async () => {
    const { accessTokenDecoderStub, fakeUser, sut, userRepositoryStub } = makeSut()
    jest
      .spyOn(accessTokenDecoderStub, 'decode')
      .mockReturnValueOnce(Promise.resolve({ userId: fakeUser.personal.id, version: fakeUser.tokenVersion.toString() }))
    jest.spyOn(userRepositoryStub, 'findById').mockImplementation(async () => {
      fakeUser.temporary.resetPasswordToken = 'any_token'

      return fakeUser
    })

    const result = await sut.verify('any_token')

    expect(result).toStrictEqual(fakeUser)
  })
})
