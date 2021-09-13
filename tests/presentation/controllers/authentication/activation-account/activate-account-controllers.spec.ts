import { makeSut } from './__mocks__/activate-account-controller-mock'

describe('LoginController', () => {
  it('Should call validate with correct values', async () => {
    const { sut, activateAccountValidatorStub, request } = makeSut()
    const validateSpy = jest.spyOn(activateAccountValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
