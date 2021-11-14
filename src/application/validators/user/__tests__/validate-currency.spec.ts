import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateCurrency } from '@/application/validators/user'

interface SutTypes {
  sut: IValidator
}

const makeSut = (): SutTypes => {
  const sut = new ValidateCurrency()

  return { sut }
}

describe('validateCurrency', () => {
  it('should return InvalidTypeError if param has an invalid type', async () => {
    const { sut } = makeSut()
    const data = { currency: 123 }

    const result = await sut.validate(data)

    expect(result).toStrictEqual(new InvalidTypeError('currency', 'string', typeof data.currency))
  })

  it('should return InvalidParamError if currency is different from USD or BRL', () => {
    const { sut } = makeSut()
    const data = { currency: 'invalid_currency' }

    const result = sut.validate(data)

    expect(result).toStrictEqual(new InvalidParamError('currency'))
  })

  it('should return undefined if currency is equal to USD', () => {
    const { sut } = makeSut()
    const data = { currency: 'USD' }

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })

  it('should return undefined if currency is equal to BRL', () => {
    const { sut } = makeSut()
    const data = { currency: 'BRL' }

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })

  it('should return undefined if param is undefined', () => {
    const { sut } = makeSut()
    const data = {}

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })
})
