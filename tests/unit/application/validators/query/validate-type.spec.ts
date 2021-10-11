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
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.type = 'invalid_type'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('type'))
  })

  it('should return undefined if succeeds', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const response = await sut.validate(request.query)

    expect(response).toBeUndefined()
  })
})
