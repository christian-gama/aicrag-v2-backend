import { makeSut } from './account-repository-sut'
import { makeFakeValidAccount } from '@/tests/__mocks__/domain/mock-account'

describe('AccountRepository', () => {
  it('Should return a user with correct values', async () => {
    const { sut, activationCodeStub, hasherStub, uuidStub } = makeSut()
    const account = makeFakeValidAccount()
    const fakeActivationCode = activationCodeStub.generate()
    const fakeHashedPassword = await hasherStub.hash(account.password)
    const fakeId = uuidStub.generate()

    const user = await sut.createAccount(account)

    expect(Object.keys(user.personal).length).toBe(4)
    expect(user.personal).toEqual({
      id: fakeId,
      name: account.name,
      email: account.email,
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
    expect(user.temporary.resetCode).toBe(null)
    expect(user.temporary.resetCodeExpiration).toBe(null)
    expect(user.temporary.temporaryEmail).toBe(null)
    expect(user.temporary.temporaryEmailExpiration).toBe(null)
  })

  it('Should call hash with correct values', async () => {
    const { sut, hasherStub } = makeSut()
    const account = makeFakeValidAccount()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.createAccount(account)

    expect(hashSpy).toHaveBeenCalledWith(account.password)
  })
})
