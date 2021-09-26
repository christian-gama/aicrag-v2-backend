import { ValidatorProtocol } from '@/application/protocols/validators'
import { InvalidParamError } from '@/application/usecases/errors'
import { ValidatePasswordComparasion } from '@/application/usecases/validators'

import faker from 'faker'

interface SutTypes {
  sut: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const sut = new ValidatePasswordComparasion()

  return { sut }
}

describe('ValidateName', () => {
  it('Should return InvalidParamError if passwords are not equal', () => {
    const { sut } = makeSut()
    const data = {
      password: faker.internet.password(),
      passwordConfirmation: faker.internet.password()
    }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return nothing if succeds', () => {
    const { sut } = makeSut()
    const password = faker.internet.password()
    const data = { password: password, passwordConfirmation: password }

    const value = sut.validate(data)

    expect(value).toBe(undefined)
  })
})
