import {
  AccountAlreadyActivatedError,
  CodeIsExpiredError,
  InvalidCodeError
} from '@/application/usecases/errors'
import { makeSut } from './validate-activation-code-sut'

describe('ValidateActivationCode', () => {
  it('Should call findAccountByEmail with correct email', async () => {
    const { sut, accountDbRepositoryStub, fakeUser } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')
    const fakeData = { email: fakeUser.personal.email, activationCode: 'any_code' }

    await sut.validate(fakeData)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(fakeData.email)
  })

  it('Should return an InvalidCodeError if activation code is not valid', async () => {
    const { sut, fakeUser } = makeSut()
    const fakeData = { email: fakeUser.personal.email, activationCode: 'invalid_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new InvalidCodeError())
  })

  it('Should return an AccountAlreadyActivated if account is already activated', async () => {
    const { sut, fakeUser } = makeSut()
    fakeUser.settings.accountActivated = true

    const fakeData = { email: fakeUser.personal.email, activationCode: 'any_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new AccountAlreadyActivatedError())
  })

  it('Should return a CodeIsExpiredError if activation code is expired', async () => {
    const { sut, fakeUser } = makeSut()
    const expirationDate = new Date(Date.now() - 1000)
    fakeUser.settings.accountActivated = false

    if (fakeUser.temporary) fakeUser.temporary.activationCodeExpiration = expirationDate

    const fakeData = {
      email: fakeUser.personal.email,
      activationCode: fakeUser.temporary.activationCode
    }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new CodeIsExpiredError())
  })

  it('Should return an InvalidCodeError if there is no activationCodeExpiration', async () => {
    const { sut, fakeUser } = makeSut()
    fakeUser.temporary.activationCodeExpiration = null

    const fakeData = { email: fakeUser.personal.email, activationCode: 'any_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new InvalidCodeError())
  })

  it('Should return an InvalidCodeError if there is no user', async () => {
    const { sut, accountDbRepositoryStub } = makeSut()
    jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail').mockReturnValueOnce(Promise.resolve(undefined))

    const fakeData = { email: 'non_existent@email.com', activationCode: 'any_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new InvalidCodeError())
  })
})
