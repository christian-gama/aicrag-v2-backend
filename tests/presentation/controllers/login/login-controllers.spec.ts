import { UserCredentialError } from '@/application/usecases/errors'
import { makeSut } from './mocks/login-controller-mock'

describe('LoginController', () => {
  it('Should call validate with correct values', async () => {
    const { sut, credentialsValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(credentialsValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should call notFound with the correct value', async () => {
    const { sut, httpHelper, credentialsValidatorStub, request } = makeSut()

    const error = new UserCredentialError()
    jest.spyOn(credentialsValidatorStub, 'validate').mockReturnValueOnce(error)

    const notFoundSpy = jest.spyOn(httpHelper, 'notFound')

    await sut.handle(request)

    expect(notFoundSpy).toHaveBeenCalledWith(error)
  })

  it('Should call findAccountByEmail with the correct value', async () => {
    const { sut, accountDbRepositoryStub, request } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')

    await sut.handle(request)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should call the encryptId with correct values', async () => {
    const { sut, jwtAdapterStub, request, fakeUser } = makeSut()
    const encryptIdSpy = jest.spyOn(jwtAdapterStub, 'encryptId')

    await sut.handle(request)

    expect(encryptIdSpy).toHaveBeenCalledWith(fakeUser.personal.id)
  })
})
