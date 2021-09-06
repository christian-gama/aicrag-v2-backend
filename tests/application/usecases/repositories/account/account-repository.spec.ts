import { fakeValidAccount } from '@/tests/domain/mocks/account-mock'
import { makeSut } from './mocks/account-repository-mock'

describe('AccountRepository', () => {
  it('Should return a user with correct values', async () => {
    const { sut, validationCodeStub, hasherStub, uuidStub } = makeSut()
    const account = fakeValidAccount
    const fakeHashedPassword = await hasherStub.hash(account.password)
    const fakeActivationCode = validationCodeStub.generate()
    const fakeId = uuidStub.generate()

    const user = await sut.createAccount(account)

    expect(user.personal).toEqual({
      id: fakeId,
      name: account.name,
      email: account.email,
      password: fakeHashedPassword
    })

    expect(user.settings).toEqual({ accountActivated: false, handicap: 1, currency: 'USD' })

    // Do not test createdAt because of inconsitence of Date.now()
    expect(user.logs.lastLoginAt).toBe(null)
    expect(user.logs.lastSeenAt).toBe(null)
    expect(user.logs.updatedAt).toBe(null)

    expect(user.temporary?.activationCode).toBe(fakeActivationCode)
  })

  it('Should call hash with correct values', async () => {
    const { sut, hasherStub } = makeSut()
    const account = fakeValidAccount
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.createAccount(account)

    expect(hashSpy).toHaveBeenCalledWith(account.password)
  })
})
