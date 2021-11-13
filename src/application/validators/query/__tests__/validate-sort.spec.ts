import { InvalidParamError, InvalidTypeError } from '@/application/errors'
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
  it('should return InvalidTypeError if sort is not a string', async () => {
    const { request, sut } = makeSut()
    request.query.sort = ['a', 'b']

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidTypeError('sort', 'string', typeof request.query.sort))
  })

  it('should return InvalidParamError if sort has more than 5 properties', async () => {
    const { request, sut } = makeSut()
    request.query.sort = 'a,b,c,d,e,f'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('Only 5 sort values are allowed'))
  })

  it('should return InvalidParamError if contain duplicated sort values', async () => {
    const { request, sut } = makeSut()
    request.query.sort = 'a,-a'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('sort'))
  })

  it('should return InvalidParamError if sort has more than 24 characters', async () => {
    const { request, sut } = makeSut()
    request.query.sort = 'this_is_a_very_long_property'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('sort'))
  })

  it('should return InvalidParamError if field is not a valid string', async () => {
    const { request, sut } = makeSut()
    request.query.sort = 'th!s_i$_@_inv#lid_prop&'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('sort'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no sort', async () => {
    const { request, sut } = makeSut()
    request.query.sort = undefined

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
