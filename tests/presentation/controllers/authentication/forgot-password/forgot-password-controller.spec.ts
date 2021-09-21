import { makeSut } from './forgot-password-controller-sut'

describe('Forgot Password', () => {
  it('Should call validate with correct email', async () => {
    const { sut, forgotPasswordValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(forgotPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should return badRequest if validation fails', async () => {
    const { sut, forgotPasswordValidatorStub, httpHelper, request } = makeSut()
    jest.spyOn(forgotPasswordValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(new Error()))
  })
})
