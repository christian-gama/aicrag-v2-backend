import { InvalidQueryError } from '@/application/errors'
import { ValidateDuration } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateDuration
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { duration: 30, operator: 'lte' } }

  const sut = new ValidateDuration()

  return { request, sut }
}

describe('validateDuration', () => {
  it('should return InvalidQueryError if duration is invalid', async () => {
    const { request, sut } = makeSut()
    request.query.duration = 31

    let result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidQueryError('duration'))

    request.query.duration = -1

    result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidQueryError('duration'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return InvalidQueryError if operator is invalid', async () => {
    const { request, sut } = makeSut()
    request.query.operator = 'invalid_operator'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidQueryError('operator'))
  })
})