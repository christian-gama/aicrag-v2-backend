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
  it('should return a user with correct values', async () => {
    expect.hasAssertions()

    const { activationCodeStub, hasherStub, sut, uuidStub } = makeSut()
    const fakeActivationCode = activationCodeStub.generate()
    const fakeSignUpUserCredentials = makeFakeSignUpUserCredentials()
    const fakeHashedPassword = await hasherStub.hash(fakeSignUpUserCredentials.password)
    const fakeId = uuidStub.generate()

    const user = await sut.createUser(fakeSignUpUserCredentials)

    expect(Object.keys(user.logs)).toHaveLength(4)
    expect(typeof user.logs.createdAt).toBe('object')
    expect(user.logs.lastLoginAt).toBeNull()
    expect(user.logs.lastSeenAt).toBeNull()
    expect(user.logs.updatedAt).toBeNull()

    expect(Object.keys(user.personal)).toHaveLength(4)
    expect(user.personal).toStrictEqual({
      email: fakeSignUpUserCredentials.email,
      id: fakeId,
      name: fakeSignUpUserCredentials.name,
      password: fakeHashedPassword
    })

    expect(Object.keys(user.settings)).toHaveLength(3)
    expect(user.settings).toStrictEqual({ accountActivated: false, currency: 'BRL', handicap: 1 })

    expect(Object.keys(user.temporary)).toHaveLength(6)
    expect(typeof user.temporary.activationCodeExpiration).toBe('object')
    expect(user.temporary.activationCode).toBe(fakeActivationCode)
    expect(user.temporary.resetPasswordToken).toBeNull()
    expect(user.temporary.tempEmail).toBeNull()
    expect(user.temporary.tempEmailCode).toBeNull()
    expect(user.temporary.tempEmailCodeExpiration).toBeNull()

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
