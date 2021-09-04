import { InvalidParamError } from '@/application/errors'
import { makeSut } from './mocks/compare-passwords-mock'

import faker from 'faker'

describe('ValidateName', () => {
  it('Should return InvalidParamError if passwords are not equal', () => {
    const sut = makeSut()
    const data = {
      password: faker.internet.password(),
      passwordConfirmation: faker.internet.password()
    }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return nothing if succeds', () => {
    const sut = makeSut()
    const password = faker.internet.password()
    const data = { password: password, passwordConfirmation: password }

    const value = sut.validate(data)

    expect(value).toBeFalsy()
  })
})
