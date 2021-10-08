import { InvalidQueryError } from '@/application/errors'
import { ValidateSort } from '@/application/validators/query'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateSort
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { sort: 'any_field,-other_field' } }

  const sut = new ValidateSort()

  return { request, sut }
}

describe('validateSort', () => {
  it('should return InvalidQueryError if sort is not a string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.sort = ['a', 'b']

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('sort'))
  })

  it('should return InvalidQueryError if sort has more than 5 properties', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.sort = 'a,b,c,d,e,f'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('Only 5 sort values are allowed'))
  })

  it('should return InvalidQueryError if contain duplicated sort values', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.sort = 'a,-a'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('sort'))
  })

  it('should return InvalidQueryError if sort has more than 24 characters', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.sort = 'this_is_a_very_long_property'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('sort'))
  })

  it('should return InvalidQueryError if field is not a valid string', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.sort = 'th!s_i$_@_inv#lid_prop&'

    const error = await sut.validate(request.query)

    expect(error).toStrictEqual(new InvalidQueryError('sort'))
  })

  it('should return undefined if succeeds', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })

  it('should return undefined if there is no sort', async () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.query.sort = undefined

    const error = await sut.validate(request.query)

    expect(error).toBeUndefined()
  })
})
