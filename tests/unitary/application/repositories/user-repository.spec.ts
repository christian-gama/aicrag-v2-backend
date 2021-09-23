import { HasherProtocol } from '@/application/protocols/cryptography'
import { UuidProtocol } from '@/application/protocols/helpers'
import { UserRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidationCode } from '@/application/usecases/helpers'
import { UserRepository } from '@/application/usecases/repositories'
import { makeHasherStub, makeValidationCodeStub, makeUuidStub, makeFakeSignUpUserCredentials } from '@/tests/__mocks__'

interface SutTypes {
  sut: UserRepositoryProtocol
  activationCodeStub: ValidationCode
  hasherStub: HasherProtocol
  uuidStub: UuidProtocol
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const activationCodeStub = makeValidationCodeStub()
  const uuidStub = makeUuidStub()
  const sut = new UserRepository(activationCodeStub, hasherStub, uuidStub)

  return { sut, activationCodeStub, hasherStub, uuidStub }
}

describe('UserRepository', () => {
  it('Should return a user with correct values', async () => {
    const { sut, activationCodeStub, hasherStub, uuidStub } = makeSut()
    const fakeSignUpUserCredentials = makeFakeSignUpUserCredentials()
    const fakeActivationCode = activationCodeStub.generate()
    const fakeHashedPassword = await hasherStub.hash(fakeSignUpUserCredentials.password)
    const fakeId = uuidStub.generate()

    const user = await sut.createUser(fakeSignUpUserCredentials)

    expect(Object.keys(user.personal).length).toBe(4)
    expect(user.personal).toEqual({
      id: fakeId,
      name: fakeSignUpUserCredentials.name,
      email: fakeSignUpUserCredentials.email,
      password: fakeHashedPassword
    })

    expect(Object.keys(user.settings).length).toBe(3)
    expect(user.settings).toEqual({ accountActivated: false, handicap: 1, currency: 'BRL' })

    expect(Object.keys(user.logs).length).toBe(4)
    expect(typeof user.logs.createdAt).toBe('object')
    expect(user.logs.lastLoginAt).toBe(null)
    expect(user.logs.lastSeenAt).toBe(null)
    expect(user.logs.updatedAt).toBe(null)

    expect(Object.keys(user.temporary).length).toBe(6)
    expect(user.temporary.activationCode).toBe(fakeActivationCode)
    expect(typeof user.temporary.activationCodeExpiration).toBe('object')
    expect(user.temporary.resetPasswordToken).toBe(null)
    expect(user.temporary.tempEmail).toBe(null)
    expect(user.temporary.tempEmailCode).toBe(null)
    expect(user.temporary.tempEmailCodeExpiration).toBe(null)

    expect(user.tokenVersion).toBe(0)
  })

  it('Should call hash with correct values', async () => {
    const { sut, hasherStub } = makeSut()
    const fakeSignUpUserCredentials = makeFakeSignUpUserCredentials()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.createUser(fakeSignUpUserCredentials)

    expect(hashSpy).toHaveBeenCalledWith(fakeSignUpUserCredentials.password)
  })
})
