import { fakeValidAccount } from '@/tests/domain/mocks/account-mock'
import { makeSut } from './mocks/account-repository-mock'

describe('AccountRepository', () => {
  it('Should return a user with correct values', async () => {
    const { sut, validationCodeStub, hasherStub, uuidStub } = makeSut()
    const account = fakeValidAccount
    const fakeHashedPassword = await hasherStub.hash(account.password)
    const fakeActivationCode = validationCodeStub.generate()
    const fakeId = uuidStub.generate()
    const dateNow = new Date(Date.now())

    const user = await sut.saveAccount(account)

    expect(user).toEqual({
      personal: { id: fakeId, name: account.name, email: account.email, password: fakeHashedPassword },
      settings: { accountActivated: false, handicap: 1, currency: 'USD' },
      logs: {
        createdAt: dateNow,
        lastLogin: null,
        lastSeen: null,
        updatedAt: null
      },
      temporary: {
        activationCode: fakeActivationCode
      }
    })
  })
})
