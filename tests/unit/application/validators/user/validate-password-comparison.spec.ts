import { IValidator } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'
import { ValidatePasswordComparison } from '@/application/validators/user'

import faker from 'faker'

interface SutTypes {
  sut: IValidator
}

const makeSut = (): SutTypes => {
  const sut = new ValidatePasswordComparison()

  return { sut }
}

describe('validatePasswordComparison', () => {
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

  it('should return nothing if succeeds', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const password = faker.internet.password()
    const data = { password: password, passwordConfirmation: password }

    const value = sut.validate(data)

    expect(value).toBeUndefined()
  })
})
