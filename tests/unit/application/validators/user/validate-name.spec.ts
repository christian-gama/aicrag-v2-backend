import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'
import { ValidateName } from '@/application/validators/user'

import faker from 'faker'

interface SutTypes {
  sut: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const sut = new ValidateName()

  return { sut }
}

describe('validateName', () => {
  it('should return InvalidParamError if name is invalid with symbols', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { name: 'Ex@mple Name' }

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('name'))
  })

  it('should return InvalidParamError if name is invalid with numbers', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { name: 'Ex4mple N4me' }

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('name'))
  })

  it('should return InvalidParamError if name is invalid with both numbers and symbols', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { name: 'Ex@mple N4me' }

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('name'))
  })

  it('should return nothing if succeeds', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { name: faker.name.findName() }

    const value = sut.validate(data)

    expect(value).toBeUndefined()
  })
})
