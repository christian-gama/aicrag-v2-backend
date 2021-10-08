import { InvalidQueryError } from '@/application/errors'
import { ValidateFields } from '@/application/validators/query'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateFields
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { fields: 'any_field,other_field' } }

  const sut = new ValidateFields()

  return { request, sut }
}

describe('validateFields', () => {
  it('should return InvalidQueryError if fields is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.fields = 123

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('fields'))
  })

  it('should return InvalidQueryError if fields has more than 10 properties', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.fields = 'a,b,c,d,e,f,g,h,i,j,k'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('Only 10 fields are allowed'))
  })

  it('should return InvalidQueryError if field has more than 24 characters', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.fields = 'this_is_a_very_long_property'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('this_is_a_very_long_property'))
  })

  it('should return InvalidQueryError if contain duplicated fields values', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.fields = 'a,-a'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('-a'))
  })

  it('should return InvalidQueryError if field is not an alphanumeric string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.fields = 'th!s_i$_@n_inv#lid_prop'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('th!s_i$_@n_inv#lid_prop'))
  })

  it('should return undefined if succeeds', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })

  it('should return undefined if there is multiple valid fields', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.fields = 'a,-b,c.b,-d'

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })

  it('should return undefined if there is no fields', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.fields = undefined

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })
})
