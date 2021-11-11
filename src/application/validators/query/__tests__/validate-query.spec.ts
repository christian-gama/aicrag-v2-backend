import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'
import { ValidateQuery } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: IValidator
}

const makeSut = (): SutTypes => {
  const request: HttpRequest = {
    body: { any_field: 'any_value' }
  }

  const sut = new ValidateQuery('any_field')

  return { request, sut }
}

describe('validateQuery', () => {
  it('should return InvalidQueryError if query is not a string', async () => {
    const { request, sut } = makeSut()
    request.body.any_field = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidQueryError('any_field'))
  })

  it('should return a new InvalidQueryError if query is invalid', () => {
    const { request, sut } = makeSut()
    request.body.any_field =
      'this_is_a_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_very_long_query'

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidQueryError('any_field'))
  })

  it('should return nothing if succeeds', () => {
    const { request, sut } = makeSut()

    const result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is any_field', () => {
    const { request, sut } = makeSut()

    delete request.body.any_field

    const result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})