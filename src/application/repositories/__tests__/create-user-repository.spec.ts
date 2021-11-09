import { IUserRole } from '@/domain'
import { IHasher } from '@/domain/cryptography'
import { IUuid } from '@/domain/helpers'
import { ICreateUserRepository } from '@/domain/repositories'
import { Pin } from '@/application/helpers'
import { CreateUserRepository } from '@/application/repositories'
import { makeHasherStub, makePinStub, makeUuidStub, makeFakeSignUpUserCredentials } from '@/tests/__mocks__'
import MockDate from 'mockdate'
interface SutTypes {
  sut: ICreateUserRepository
  activationPinStub: Pin
  hasherStub: IHasher
  uuidStub: IUuid
}

const makeSut = (): SutTypes => {
  const activationPinStub = makePinStub()
  const hasherStub = makeHasherStub()
  const uuidStub = makeUuidStub()

  const sut = new CreateUserRepository(activationPinStub, hasherStub, uuidStub)

  return { activationPinStub, hasherStub, sut, uuidStub }
}

describe('createUserRepository', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return a user with correct values', async () => {
    const { activationPinStub, hasherStub, sut, uuidStub } = makeSut()
    const fakeActivationCode = activationPinStub.generate()
    const fakeSignUpUserCredentials = makeFakeSignUpUserCredentials()
    const fakeHashedPassword = await hasherStub.hash(fakeSignUpUserCredentials.password)
    const fakeId = uuidStub.generate()

    const result = await sut.createUser(fakeSignUpUserCredentials)

    expect(result.logs).toStrictEqual({
      createdAt: new Date(Date.now()),
      lastLoginAt: null,
      lastSeenAt: null,
      updatedAt: null
    })

    expect(result.personal).toStrictEqual({
      email: fakeSignUpUserCredentials.email,
      id: fakeId,
      name: fakeSignUpUserCredentials.name,
      password: fakeHashedPassword
    })

    expect(result.settings).toStrictEqual({
      accountActivated: false,
      currency: 'BRL',
      handicap: 1,
      role: IUserRole.user
    })

    expect(result.temporary).toStrictEqual({
      activationPin: fakeActivationCode,
      activationPinExpiration: new Date(Date.now() + 10 * 60 * 1000),
      resetPasswordToken: null,
      tempEmail: null,
      tempEmailPin: null,
      tempEmailPinExpiration: null
    })

    expect(result.tokenVersion).toBe(0)
  })

  it('should call hash with correct values', async () => {
    const { hasherStub, sut } = makeSut()
    const fakeSignUpUserCredentials = makeFakeSignUpUserCredentials()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.createUser(fakeSignUpUserCredentials)

    expect(hashSpy).toHaveBeenCalledWith(fakeSignUpUserCredentials.password)
  })
})
