import { ValidatorProtocol } from '@/application/protocols/validators'
import { InvalidParamError } from '@/application/usecases/errors'
import { ValidateName } from '@/application/usecases/validators'
import { config } from '@/tests/config'

import faker from 'faker'

interface SutTypes {
  sut: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const sut = new ValidateName()

  return { sut }
}

describe('ValidateName', () => {
  it('Should return InvalidParamError if name is invalid with symbols', () => {
    const { sut } = makeSut()
    const data = { name: 'Ex@mple Name' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return InvalidParamError if name is invalid with numbers', () => {
    const { sut } = makeSut()
    const data = { name: 'Ex4mple N4me' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return InvalidParamError if name is invalid with both numbers and symbols', () => {
    const { sut } = makeSut()
    const data = { name: 'Ex@mple N4me' }

    const value = sut.validate(data)

    expect(value).toEqual(new InvalidParamError('name'))
  })

  it('Should return nothing if succeds', () => {
    const { sut } = makeSut()

    let error = 0
    for (let i = 0; i < config.loopTimes; i++) {
      const data = { name: faker.name.findName() }

      const value = sut.validate(data)

      if (value !== undefined) error++
    }

    expect(error).toBe(0)
  })
})
