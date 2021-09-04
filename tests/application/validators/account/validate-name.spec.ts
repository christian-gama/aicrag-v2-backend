import { InvalidParamError } from '@/application/errors'
import { makeSut } from './mocks/validate-name-mock'

import faker from 'faker'

describe('ValidateName', () => {
  it('Should return InvalidParamError if name is invalid with symbols', () => {
    const sut = makeSut()
    const data = { name: 'Ex@mple Name' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return InvalidParamError if name is invalid with numbers', () => {
    const sut = makeSut()
    const data = { name: 'Ex4mple N4me' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return InvalidParamError if name is invalid with both numbers and symbols', () => {
    const sut = makeSut()
    const data = { name: 'Ex@mple N4me' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return nothing if succeds', () => {
    const sut = makeSut()
    const data = { name: faker.name.findName() }

    const value = sut.validate(data)

    expect(value).toBeFalsy()
  })
})
