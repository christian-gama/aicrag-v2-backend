import { InvalidQueryError } from '@/application/errors'
import { ValidateLimit } from '@/application/validators/query'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateLimit
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { limit: '10' } }

  const sut = new ValidateLimit()

  return { request, sut }
}

describe('validateLimit', () => {
  it('should return InvalidQueryError if limit is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.limit = ['a', 'b']

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('limit'))
  })

  it('should return InvalidQueryError if limit does not contain a number', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.limit = 'abc'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('limit'))
  })

  it('should return InvalidQueryError if limit is not an integer', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.limit = '1.2'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('limit'))
  })

  it('should return InvalidQueryError if limit is not a safe integer', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.limit = '9007199254740992'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('limit'))
  })

  it('should return InvalidQueryError if limit greater than 1000', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.limit = '1001'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('limit'))
  })

  it('should return InvalidQueryError if limit lesser or equal to 0', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.limit = '0'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('limit'))
  })

  it('should return undefined if succeeds', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })

  it('should return undefined if there is no limit', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.limit = undefined

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })
})
