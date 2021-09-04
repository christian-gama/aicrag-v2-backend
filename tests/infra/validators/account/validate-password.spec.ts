import { InvalidParamError } from '@/infra/errors'
import { makeSut } from './mocks/validate-password-mock'

import faker from 'faker'

describe('ValidateName', () => {
  it('Should return InvalidParamError if password is lesser than 6 characters', () => {
    const sut = makeSut()
    const data = { password: faker.internet.password(5) }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return InvalidParamError if password is greater than 32 characters', () => {
    const sut = makeSut()
    const data = { password: faker.internet.password(33) }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return InvalidParamError if password is empty', () => {
    const sut = makeSut()
    const data = { password: '' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('password'))
  })

  it('Should return nothing if succeds', () => {
    const sut = makeSut()
    const data1 = { password: faker.internet.password(6) }

    const value1 = sut.validate(data1)

    expect(value1).toBeFalsy()

    const data2 = { password: faker.internet.password(32) }

    const value2 = sut.validate(data2)

    expect(value2).toBeFalsy()
  })
})
