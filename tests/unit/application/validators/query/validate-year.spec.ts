import { InvalidQueryError } from '@/application/errors'
import { ValidateYear } from '@/application/validators/query'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateYear
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { year: '2021' } }

  const sut = new ValidateYear()

  return { request, sut }
}

describe('validateYear', () => {
  it('should return InvalidQueryError if year is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.year = ['a', 'b']

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('year'))
  })

  it('should return InvalidQueryError if year is not valid', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.year = '123'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('year'))
  })

  it('should return undefined if succeeds', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const response = await sut.validate(request.query)

    expect(response).toBeUndefined()
  })
})
