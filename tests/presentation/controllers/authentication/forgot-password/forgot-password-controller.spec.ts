import { makeSut } from './forgot-password-controller-sut'

describe('Forgot Password', () => {
  it('Should call validate with correct email', async () => {
    const { sut, forgotPasswordValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(forgotPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body.email)
  })
})
