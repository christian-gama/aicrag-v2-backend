import { ValidatorProtocol } from '@/application/protocols/validators'
import { InvalidParamError } from '@/application/usecases/errors'
import { ValidatePassword } from '@/application/usecases/validators'

import faker from 'faker'

interface SutTypes {
  sut: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const sut = new ValidatePassword()

  return { sut }
}

describe('validateName', () => {
  it('should return InvalidParamError if password is lesser than 6 characters', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { password: faker.internet.password(5) }

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('password'))
  })

  it('should return InvalidParamError if password is greater than 32 characters', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { password: faker.internet.password(33) }

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('password'))
  })

  it('should return InvalidParamError if password is empty', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { password: '' }

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('password'))
  })

  it('should return nothing if succeds', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data1 = { password: faker.internet.password(6) }
    const data2 = { password: faker.internet.password(32) }

    const value1 = sut.validate(data1)
    const value2 = sut.validate(data2)

    expect(value1).toBeFalsy()
    expect(value2).toBeFalsy()
  })
})
