import { IUser } from '@/domain'
import { IEncrypter } from '@/domain/cryptography'
import { GenerateAccessToken } from '@/infra/token'
import { makeEncrypterStub, makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  encrypterStub: IEncrypter
  fakeUser: IUser
  sut: GenerateAccessToken
}
const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const encrypterStub = makeEncrypterStub()

  const sut = new GenerateAccessToken(encrypterStub)

  return { encrypterStub, fakeUser, sut }
}

describe('generateAccessToken', () => {
  it('should call encrypt with correct value', () => {
    const { encrypterStub, fakeUser, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    sut.generate(fakeUser)

    expect(encryptSpy).toHaveBeenCalledWith({
      currency: fakeUser.settings.currency,
      email: fakeUser.personal.email,
      name: fakeUser.personal.name,
      userId: fakeUser.personal.id
    })
  })
})
