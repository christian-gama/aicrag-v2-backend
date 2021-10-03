import { HasherProtocol } from '@/domain/cryptography'
import { UuidProtocol } from '@/domain/helpers'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { ValidationCode } from '@/application/helpers'
import { UserRepository } from '@/application/repositories'

import {
  makeHasherStub,
  makeValidationCodeStub,
  makeUuidStub,
  makeFakeSignUpUserCredentials
} from '@/tests/__mocks__'

import MockDate from 'mockdate'
interface SutTypes {
  sut: UserRepositoryProtocol
  activationCodeStub: ValidationCode
  hasherStub: HasherProtocol
  uuidStub: UuidProtocol
}

const makeSut = (): SutTypes => {
  const activationCodeStub = makeValidationCodeStub()
  const hasherStub = makeHasherStub()
  const uuidStub = makeUuidStub()

  const sut = new UserRepository(activationCodeStub, hasherStub, uuidStub)

  return { activationCodeStub, hasherStub, sut, uuidStub }
}

describe('userRepository', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should return a user with correct values', async () => {
    expect.hasAssertions()

    const { activationCodeStub, hasherStub, sut, uuidStub } = makeSut()
    const fakeActivationCode = activationCodeStub.generate()
    const fakeSignUpUserCredentials = makeFakeSignUpUserCredentials()
    const fakeHashedPassword = await hasherStub.hash(fakeSignUpUserCredentials.password)
    const fakeId = uuidStub.generate()

    const user = await sut.createUser(fakeSignUpUserCredentials)

    expect(user.logs).toStrictEqual({
      createdAt: new Date(Date.now()),
      lastLoginAt: null,
      lastSeenAt: null,
      updatedAt: null
    })

    expect(user.personal).toStrictEqual({
      email: fakeSignUpUserCredentials.email,
      id: fakeId,
      name: fakeSignUpUserCredentials.name,
      password: fakeHashedPassword
    })

    expect(user.settings).toStrictEqual({ accountActivated: false, currency: 'BRL', handicap: 1 })

    expect(user.temporary).toStrictEqual({
      activationCode: fakeActivationCode,
      activationCodeExpiration: new Date(Date.now() + 10 * 60 * 1000),
      resetPasswordToken: null,
      tempEmail: null,
      tempEmailCode: null,
      tempEmailCodeExpiration: null
    })

    expect(user.tokenVersion).toBe(0)
  })

  it('should call hash with correct values', async () => {
    expect.hasAssertions()

    const { hasherStub, sut } = makeSut()
    const fakeSignUpUserCredentials = makeFakeSignUpUserCredentials()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.createUser(fakeSignUpUserCredentials)

    expect(hashSpy).toHaveBeenCalledWith(fakeSignUpUserCredentials.password)
  })
})
