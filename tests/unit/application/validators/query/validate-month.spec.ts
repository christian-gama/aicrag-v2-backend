import { InvalidQueryError } from '@/application/errors'
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
  it('should return InvalidQueryError if month is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.month = ['a', 'b']

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidQueryError('month'))
  })

  it('should return InvalidQueryError if month contains more than 2 characters', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.month = '123'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidQueryError('month'))
  })

  it('should return InvalidQueryError if month is not valid', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.month = '13'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidQueryError('month'))
  })

  it('should return undefined if succeeds', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
