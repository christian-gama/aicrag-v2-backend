import { InvalidParamError } from '@/application/errors'
import { ValidateTypeFilter } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateTypeFilter
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { type: 'TX' } }

  const sut = new ValidateTypeFilter()

  return { request, sut }
}

describe('validateTypeFilter', () => {
  it('should return InvalidParamError if type is invalid', async () => {
    const { request, sut } = makeSut()
    request.query.type = 'invalid_type'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('type'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
