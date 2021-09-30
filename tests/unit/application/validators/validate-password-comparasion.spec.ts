import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'
import { ValidatePasswordComparasion } from '@/application/validators'

import faker from 'faker'

interface SutTypes {
  sut: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const sut = new ValidatePasswordComparasion()

  return { sut }
}

describe('validateName', () => {
  it('should return InvalidParamError if passwords are not equal', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = {
      password: faker.internet.password(),
      passwordConfirmation: faker.internet.password()
    }

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('should return nothing if succeds', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const password = faker.internet.password()
    const data = { password: password, passwordConfirmation: password }

    const value = sut.validate(data)

    expect(value).toBeUndefined()
  })
})
