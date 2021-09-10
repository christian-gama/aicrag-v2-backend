import { makeSut } from './mocks/login-controller-mock'

describe('SignUpController', () => {
  it('Should call validate with correct values', async () => {
    const { sut, credentialsValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(credentialsValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
