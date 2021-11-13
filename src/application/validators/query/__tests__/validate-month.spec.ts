import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateMonth } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateMonth
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { month: '11' } }

  const sut = new ValidateMonth()

  return { request, sut }
}

describe('validateMonth', () => {
  it('should return InvalidTypeError if month is not a string', async () => {
    const { request, sut } = makeSut()
    request.query.month = ['a', 'b']

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidTypeError('month', 'string', typeof request.query.month))
  })

  it('should return InvalidParamError if month contains more than 2 characters', async () => {
    const { request, sut } = makeSut()
    request.query.month = '123'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('month'))
  })

  it('should return InvalidParamError if month is not valid', async () => {
    const { request, sut } = makeSut()
    request.query.month = '13'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('month'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
