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
})
