import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'
import { ValidateCurrency } from '@/application/validators'

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
})
