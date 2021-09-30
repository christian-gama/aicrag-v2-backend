import { IUser } from '@/domain'
import { EncrypterProtocol } from '@/domain/cryptography'
import { UserDbRepositoryProtocol } from '@/domain/repositories'

import { GenerateRefreshToken } from '@/infra/token'

import { makeEncrypterStub, makeFakeUser, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  encrypterStub: EncrypterProtocol
  fakeUser: IUser
  sut: GenerateRefreshToken
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const encrypterStub = makeEncrypterStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new GenerateRefreshToken(encrypterStub, userDbRepositoryStub)

  return { encrypterStub, fakeUser, sut, userDbRepositoryStub }
}

describe('generateAccessToken', () => {
  it('should call updateUser with correct value', async () => {
    expect.hasAssertions()

    const { fakeUser, sut, userDbRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.generate(fakeUser)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser, { tokenVersion: fakeUser.tokenVersion })
  })

  it('should call encrypt with correct value', async () => {
    expect.hasAssertions()

    const { encrypterStub, fakeUser, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.generate(fakeUser)

    expect(encryptSpy).toHaveBeenCalledWith({
      userId: fakeUser.personal.id,
      version: fakeUser.tokenVersion.toString()
    })
  })
})
