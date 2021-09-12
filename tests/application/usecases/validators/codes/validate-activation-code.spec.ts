import { makeSut } from './__mocks__/codes/validate-activation-code-mock'

describe('ValidateActivationCode', () => {
  it('Should call findAccountByEmail with correct email', async () => {
    const { sut, accountDbRepositoryStub, fakeUser } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')

    await sut.validate(fakeUser.personal.email)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(fakeUser.personal.email)
  })
})
