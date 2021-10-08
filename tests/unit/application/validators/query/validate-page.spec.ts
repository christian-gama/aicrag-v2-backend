import { InvalidQueryError } from '@/application/errors'
import { ValidatePage } from '@/application/validators/query'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidatePage
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { page: '1' } }

  const sut = new ValidatePage()

  return { request, sut }
}

describe('validatePage', () => {
  it('should return InvalidQueryError if page is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.page = ['a', 'b']

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('page'))
  })

  it('should return InvalidQueryError if page does not contain a number', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.page = 'abc'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('page'))
  })

  it('should return InvalidQueryError if page is not an integer', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.page = '1.2'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('page'))
  })

  it('should return InvalidQueryError if page is not a safe integer', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.page = '9007199254740992'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('page'))
  })

  it('should return InvalidQueryError if page lesser or equal to 0', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.page = '0'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('page'))
  })

  it('should return undefined if succeeds', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })

  it('should return undefined if there is no page', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.page = undefined

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })
})
