import { InvalidCodeError } from '@/application/usecases/errors'
import { makeSut } from './__mocks__/codes/validate-activation-code-mock'

describe('ValidateActivationCode', () => {
  it('Should call findAccountByEmail with correct email', async () => {
    const { sut, accountDbRepositoryStub, fakeUser } = makeSut()
    const findAccountByEmailSpy = jest.spyOn(accountDbRepositoryStub, 'findAccountByEmail')
    const fakeData = { email: fakeUser.personal.email, activationCode: 'any_code' }

    await sut.validate(fakeData)

    expect(findAccountByEmailSpy).toHaveBeenCalledWith(fakeData.email)
  })

  it('Should return an InvalidCodeError if activation code is not valid', async () => {
    const { sut, fakeUser } = makeSut()
    const fakeData = { email: fakeUser.personal.email, activationCode: 'invalid_code' }

    const value = await sut.validate(fakeData)

    expect(value).toEqual(new InvalidCodeError())
  })
})
