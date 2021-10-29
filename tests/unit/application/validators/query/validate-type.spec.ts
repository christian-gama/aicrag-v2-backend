import { InvalidQueryError } from '@/application/errors'
import { ValidateType } from '@/application/validators/query'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateType
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { type: 'TX' } }

  const sut = new ValidateType()

  return { request, sut }
}

describe('validateType', () => {
  it('should return InvalidQueryError if type is invalid', async () => {
    const { request, sut } = makeSut()
    request.query.type = 'invalid_type'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidQueryError('type'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
