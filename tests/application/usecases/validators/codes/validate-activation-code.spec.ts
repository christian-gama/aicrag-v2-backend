import { makeSut } from './__mocks__/codes/validate-activation-code-mock'

describe('ValidateActivationCode', () => {
  it('Should call findAccountByEmail with correct email', async () => {
    const { sut, accountDbRepositoryStub, fakeUser } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')
    const fakeData = { email: fakeUser.personal.email, activationCode: 'any_code' }

    await sut.validate(fakeData)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(fakeData.email)
  })
})
