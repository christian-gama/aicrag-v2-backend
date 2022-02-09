import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateDate } from '@/application/validators/task'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateDate
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { date: new Date().toISOString() } }

  const sut = new ValidateDate()

  return { request, sut }
}

describe('validateDate', () => {
  it('should return InvalidTypeError if date has an invalid type', () => {
    const { sut } = makeSut()
    const data = { date: 123 }

    const result = sut.validate(data)

    expect(result).toStrictEqual(new InvalidTypeError('date', 'string', typeof data.date))
  })

  it('should return InvalidParamError if is an invalid date', () => {
    const { request, sut } = makeSut()
    request.body.date = 'invalid_date'

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('date'))
  })

  it('should return undefined if is a valid date', () => {
    const { request, sut } = makeSut()

    const result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if param is undefined', () => {
    const { sut } = makeSut()
    const data = {}

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })
})
