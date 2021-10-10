import { IUser } from '@/domain'
import { EncrypterProtocol } from '@/domain/cryptography'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { GenerateRefreshToken } from '@/infra/token'

import { makeEncrypterStub, makeFakeUser, makeUserRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  encrypterStub: EncrypterProtocol
  fakeUser: IUser
  sut: GenerateRefreshToken
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const encrypterStub = makeEncrypterStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new GenerateRefreshToken(encrypterStub, userRepositoryStub)

  return { encrypterStub, fakeUser, sut, userRepositoryStub }
}

describe('generateAccessToken', () => {
  it('should call updateUser with correct value', async () => {
    expect.hasAssertions()

    const { fakeUser, sut, userRepositoryStub } = makeSut()
    const updateUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')

    await sut.generate(fakeUser)

    expect(updateUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, { tokenVersion: fakeUser.tokenVersion })
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
