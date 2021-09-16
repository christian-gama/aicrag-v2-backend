import { makeSut } from './user-repository-sut'
import { makeFakeSignUpUserCredentials } from '@/tests/__mocks__/domain/mock-signup-user-credentials'

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

    expect(Object.keys(user.temporary).length).toBe(7)
    expect(user.temporary.activationCode).toBe(fakeActivationCode)
    expect(typeof user.temporary.activationCodeExpiration).toBe('object')
    expect(user.temporary.refreshToken).toBe(null)
    expect(user.temporary.resetCode).toBe(null)
    expect(user.temporary.resetCodeExpiration).toBe(null)
    expect(user.temporary.temporaryEmail).toBe(null)
    expect(user.temporary.temporaryEmailExpiration).toBe(null)
  })

  it('Should call hash with correct values', async () => {
    const { sut, hasherStub } = makeSut()
    const fakeSignUpUserCredentials = makeFakeSignUpUserCredentials()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.createUser(fakeSignUpUserCredentials)

    expect(hashSpy).toHaveBeenCalledWith(fakeSignUpUserCredentials.password)
  })
})
