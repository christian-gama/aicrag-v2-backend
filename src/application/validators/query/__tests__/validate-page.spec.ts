import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidatePage } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidatePage
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { page: '1' } }

  const sut = new ValidatePage()

  return { request, sut }
}

describe('validatePage', () => {
  it('should return InvalidTypeError if page is not a string', async () => {
    const { request, sut } = makeSut()
    request.query.page = ['a', 'b']

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidTypeError('page', 'string', typeof request.query.page))
  })

  it('should return InvalidParamError if page does not contain a number', async () => {
    const { request, sut } = makeSut()
    request.query.page = 'abc'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('page'))
  })

  it('should return InvalidParamError if page is not an integer', async () => {
    const { request, sut } = makeSut()
    request.query.page = '1.2'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('page'))
  })

  it('should return InvalidParamError if page is not a safe integer', async () => {
    const { request, sut } = makeSut()
    request.query.page = '9007199254740992'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('page'))
  })

  it('should return InvalidParamError if page lesser or equal to 0', async () => {
    const { request, sut } = makeSut()
    request.query.page = '0'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('page'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no page', async () => {
    const { request, sut } = makeSut()
    request.query.page = undefined

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
