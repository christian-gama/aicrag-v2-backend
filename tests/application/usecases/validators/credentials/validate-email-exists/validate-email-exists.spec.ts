import { UserCredentialError } from '@/application/usecases/errors'
import { makeSut } from './validate-email-exists-sut'

describe('ValidateCredentials', () => {
  it('Should return a UserCredentialError if email does not exists', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    jest
      .spyOn(userDbRepositoryStub, 'findUserByEmail')
      .mockReturnValueOnce(Promise.resolve(undefined))
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    const error = await sut.validate(credentials)

    expect(error).toEqual(new UserCredentialError())
  })

  it('Should call findUserByEmail with correct value', async () => {
    const { sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')
    const credentials = { email: 'invalid_email@email.com', password: 'any_password' }

    await sut.validate(credentials)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(credentials.email)
  })
})
