import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'
import { ValidateCurrency } from '@/application/validators/user'

interface SutTypes {
  sut: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const sut = new ValidateCurrency()

  return { sut }
}

describe('validateCurrency', () => {
  it('should return InvalidParamError if currency is different from USD or BRL', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { currency: 'invalid_currency' }

    const value = sut.validate(data)

    expect(value).toStrictEqual(new InvalidParamError('currency'))
  })

  it('should return undefined if currency is equal to USD', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { currency: 'USD' }

    const value = sut.validate(data)

    expect(value).toBeUndefined()
  })

  it('should return undefined if currency is equal to BRL', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { currency: 'BRL' }

    const value = sut.validate(data)

    expect(value).toBeUndefined()
  })
})
