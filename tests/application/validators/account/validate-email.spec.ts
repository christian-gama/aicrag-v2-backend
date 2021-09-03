import { InvalidParamError } from '@/application/errors'
import { fakeValidAccount } from './mocks/account-mock'
import { makeSut } from './mocks/validate-email-mock'

describe('ValidateEmail', () => {
  it('Should return a new InvalidParamError if email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockReturnValueOnce(false)

    const fakeInvalidAccount = {
      name: 'Example Name',
      email: 'invalid_email',
      password: 'password',
      passwordConfirmation: 'password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toEqual(new InvalidParamError('email'))
  })

  it('Should return nothing if succeds', () => {
    const { sut } = makeSut()

    const value = sut.validate(fakeValidAccount)

    expect(value).toBeFalsy()
  })

  it('Should call emailValidator with correct value', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isEmailSpy = jest.spyOn(emailValidatorStub, 'isEmail')

    sut.validate(fakeValidAccount)

    expect(isEmailSpy).toHaveBeenCalledWith(fakeValidAccount.email)
  })

  it('Should throw if emailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isEmail').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })
})
