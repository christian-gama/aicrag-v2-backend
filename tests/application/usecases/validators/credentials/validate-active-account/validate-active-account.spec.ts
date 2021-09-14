import { InactiveAccountError } from '@/application/usecases/errors'
import { makeSut } from './validate-active-account-sut'

describe('ValidateCredentials', () => {
  it('Should return a InactiveAccountError if user account is inactive', async () => {
    const { sut, accountDbRepositoryStub, fakeUser } = makeSut()
    fakeUser.settings.accountActivated = false
    jest
      .spyOn(accountDbRepositoryStub, 'saveAccount')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const result = await sut.validate(fakeUser)

    expect(result).toEqual(new InactiveAccountError())
  })

  it('Should call findAccountByEmail with correct value', async () => {
    const { sut, accountDbRepositoryStub } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })

  it('Should return nothing if succeds', async () => {
    const { sut } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const value = await sut.validate(credentials)

    expect(value).toBe(undefined)
  })
})
