import { InactiveAccountError } from '@/application/usecases/errors'
import { makeSut } from './validate-active-account-sut'

describe('ValidateCredentials', () => {
  it('Should return a InactiveAccountError if user account is inactive', async () => {
    const { sut, userDbRepositoryStub, fakeUser } = makeSut()
    fakeUser.settings.accountActivated = false
    jest
      .spyOn(userDbRepositoryStub, 'saveUser')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const result = await sut.validate(fakeUser)

    expect(result).toEqual(new InactiveAccountError())
  })

  it('Should call findUserByEmail with correct value', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })

  it('Should return nothing if succeds', async () => {
    const { sut } = makeSut()
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const value = await sut.validate(credentials)

    expect(value).toBe(undefined)
  })
})
