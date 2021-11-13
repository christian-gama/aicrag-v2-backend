import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidatePeriod } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidatePeriod
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { period: 'today' } }

  const sut = new ValidatePeriod()

  return { request, sut }
}

describe('validatePeriod', () => {
  it('should return InvalidParamError if period is invalid', async () => {
    const { request, sut } = makeSut()
    request.query.period = 'invalid_period'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('period'))
  })

  it('should return InvalidTypeError if period is not a string', async () => {
    const { request, sut } = makeSut()
    request.query.period = 123

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidTypeError('period', 'string', typeof request.query.period))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no period', async () => {
    const { request, sut } = makeSut()
    request.query.period = undefined

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
