import { UserCredentialError } from '@/application/usecases/errors'
import { makeSut } from './__mocks__/validate-email-exists-mock'

describe('ValidateCredentials', () => {
  it('Should return a UserCredentialError if email does not exists', async () => {
    const { sut, accountDbRepositoryStub } = makeSut()
    jest
      .spyOn(accountDbRepositoryStub, 'findAccountByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const error = await sut.validate(credentials)

    expect(error).toEqual(new UserCredentialError())
  })

  it('Should call findAccountByEmail with correct value', async () => {
    const { sut, accountDbRepositoryStub } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })
})
