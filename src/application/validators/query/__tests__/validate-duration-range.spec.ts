import { InvalidParamError } from '@/application/errors'
import { ValidateDurationRange } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateDurationRange
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { duration: 30, operator: 'lte' } }

  const sut = new ValidateDurationRange()

  return { request, sut }
}

describe('validateDurationRange', () => {
  it('should return InvalidParamError if duration is invalid', async () => {
    const { request, sut } = makeSut()
    request.query.duration = 31

    let result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('duration'))

    request.query.duration = -1

    result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return InvalidParamError if operator is invalid', async () => {
    const { request, sut } = makeSut()
    request.query.operator = 'invalid_operator'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('operator'))
  })
})
