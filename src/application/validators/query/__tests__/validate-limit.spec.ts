import { InvalidParamError } from '@/application/errors'
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
  it('should return InvalidParamError if limit is not a string', async () => {
    const { request, sut } = makeSut()
    request.query.limit = ['a', 'b']

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('limit'))
  })

  it('should return InvalidParamError if limit does not contain a number', async () => {
    const { request, sut } = makeSut()
    request.query.limit = 'abc'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('limit'))
  })

  it('should return InvalidParamError if limit is not an integer', async () => {
    const { request, sut } = makeSut()
    request.query.limit = '1.2'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('limit'))
  })

  it('should return InvalidParamError if limit is not a safe integer', async () => {
    const { request, sut } = makeSut()
    request.query.limit = '9007199254740992'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('limit'))
  })

  it('should return InvalidParamError if limit greater than 1000', async () => {
    const { request, sut } = makeSut()
    request.query.limit = '1001'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('limit'))
  })

  it('should return InvalidParamError if limit lesser or equal to 0', async () => {
    const { request, sut } = makeSut()
    request.query.limit = '0'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('limit'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no limit', async () => {
    const { request, sut } = makeSut()
    request.query.limit = undefined

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
