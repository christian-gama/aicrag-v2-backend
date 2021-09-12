import { makeSut } from './__mocks__/account-repository-mock'
import { makeFakeValidAccount } from '@/tests/domain/__mocks__/account-mock'

describe('AccountRepository', () => {
  it('Should return a user with correct values', async () => {
    const { sut, activationCodeStub, hasherStub, uuidStub } = makeSut()
    const account = makeFakeValidAccount()
    const fakeActivationCode = activationCodeStub.generate()
    const fakeHashedPassword = await hasherStub.hash(account.password)
    const fakeId = uuidStub.generate()

    const user = await sut.createAccount(account)

    expect(user.personal).toEqual({
      id: fakeId,
      name: account.name,
      email: account.email,
      password: fakeHashedPassword
    })

    expect(user.settings).toEqual({ accountActivated: false, handicap: 1, currency: 'BRL' })

    // Do not test createdAt because of inconsitence of Date.now()
    expect(user.logs.lastLoginAt).toBe(null)
    expect(user.logs.lastSeenAt).toBe(null)
    expect(user.logs.updatedAt).toBe(null)

    expect(user.temporary?.activationCode).toBe(fakeActivationCode)
    expect(typeof user.temporary?.activationCodeExpiration).toBe('object')
  })

  it('Should call hash with correct values', async () => {
    const { sut, hasherStub } = makeSut()
    const account = makeFakeValidAccount()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.createAccount(account)

    expect(hashSpy).toHaveBeenCalledWith(account.password)
  })
})
