import { IValidator } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'
import { ValidateCurrency } from '@/application/validators/user'

interface SutTypes {
  sut: IValidator
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

    const result = sut.validate(data)

    expect(result).toStrictEqual(new InvalidParamError('currency'))
  })

  it('should return undefined if currency is equal to USD', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { currency: 'USD' }

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })

  it('should return undefined if currency is equal to BRL', () => {
    expect.hasAssertions()

    const { sut } = makeSut()
    const data = { currency: 'BRL' }

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })
})
