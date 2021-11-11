import { InvalidQueryError } from '@/application/errors'
import { ValidateName } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateName
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { name: 'Any Name' } }

  const sut = new ValidateName()

  return { request, sut }
}

describe('validateName', () => {
  it('should return InvalidQueryError if name is invalid', () => {
    const { request, sut } = makeSut()
    request.query.name = 'inv4lid_n4me'

    const result = sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidQueryError('name'))
  })

  it('should return undefined if succeeds', () => {
    const { request, sut } = makeSut()

    const result = sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no name', () => {
    const { request, sut } = makeSut()

    delete request.query.name

    const result = sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
