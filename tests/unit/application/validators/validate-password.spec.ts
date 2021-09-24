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

describe('ValidateName', () => {
  it('Should return InvalidParamError if password is lesser than 6 characters', () => {
    const { sut } = makeSut()
    const data = { password: faker.internet.password(5) }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return InvalidParamError if password is greater than 32 characters', () => {
    const { sut } = makeSut()
    const data = { password: faker.internet.password(33) }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return InvalidParamError if password is empty', () => {
    const { sut } = makeSut()
    const data = { password: '' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return nothing if succeds', () => {
    const { sut } = makeSut()
    const data1 = { password: faker.internet.password(6) }
    const data2 = { password: faker.internet.password(32) }

    const value1 = sut.validate(data1)
    const value2 = sut.validate(data2)

    expect(value1).toBeFalsy()
    expect(value2).toBeFalsy()
  })
})
