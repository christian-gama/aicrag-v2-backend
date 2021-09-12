import { UserCredentialError } from '@/application/usecases/errors'
import { makeSut } from './__mocks__/validate-password-matches-mock'

describe('ValidatePasswordMatches', () => {
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

  it('Should return a UserCredentialError if password does not match', async () => {
    const { sut, comparerStub } = makeSut()
    jest.spyOn(comparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const result = await sut.validate(credentials)

    expect(result).toEqual(new UserCredentialError())
  })

  it('Should call compare with correct value', async () => {
    const { sut, comparerStub, fakeUser } = makeSut()
    const compareSpy = jest.spyOn(comparerStub, 'compare')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(compareSpy).toHaveBeenCalledWith(credentials.password, fakeUser.personal.password)
  })
})
