import { InvalidParamError } from '@/application/errors'
import { fakeValidAccount } from '../mocks/account/account-mock'
import { makeSut } from '../mocks/account/compare-passwords-mock'

describe('ValidateName', () => {
  it('Should return InvalidParamError if passwords are not equal', () => {
    const sut = makeSut()
    const fakeInvalidAccount = {
      name: 'Example Name',
      email: 'example@email.com',
      password: 'password',
      passwordConfirmation: 'different_password'
    }

    const value = sut.validate(fakeInvalidAccount)

    expect(value).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return nothing if succeds', () => {
    const sut = makeSut()

    const value = sut.validate(fakeValidAccount)

    expect(value).toBeFalsy()
  })
})
