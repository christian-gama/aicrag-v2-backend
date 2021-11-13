import { IUser } from '@/domain'
import { IEncrypter } from '@/domain/cryptography'
import { IUserRepository } from '@/domain/repositories'
import { GenerateRefreshToken } from '@/infra/token'
import { makeEncrypterStub, makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  encrypterStub: IEncrypter
  fakeUser: IUser
  sut: GenerateRefreshToken
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const encrypterStub = makeEncrypterStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new GenerateRefreshToken(encrypterStub, userRepositoryStub)

  return { encrypterStub, fakeUser, sut, userRepositoryStub }
}

describe('generateAccessToken', () => {
  it('should call updateById with correct value', async () => {
    const { fakeUser, sut, userRepositoryStub } = makeSut()
    const updateByIdSpy = jest.spyOn(userRepositoryStub, 'updateById')

    await sut.generate(fakeUser)

    expect(updateByIdSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      tokenVersion: fakeUser.tokenVersion
    })
  })

  it('should call encrypt with correct value', async () => {
    const { encrypterStub, fakeUser, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.generate(fakeUser)

    expect(encryptSpy).toHaveBeenCalledWith({
      userId: fakeUser.personal.id,
      version: fakeUser.tokenVersion.toString()
    })
  })
})
