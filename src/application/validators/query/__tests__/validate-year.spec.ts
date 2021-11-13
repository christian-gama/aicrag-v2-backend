import { InvalidParamError } from '@/application/errors'
import { ValidateYear } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateYear
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { year: '2021' } }

  const sut = new ValidateYear()

  return { request, sut }
}

describe('validateYear', () => {
  it('should return InvalidParamError if year is not a string', async () => {
    const { request, sut } = makeSut()
    request.query.year = ['a', 'b']

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('year'))
  })

  it('should return InvalidParamError if year is not valid', async () => {
    const { request, sut } = makeSut()
    request.query.year = '123'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('year'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no taskId', async () => {
    const { request, sut } = makeSut()
    request.query.taskId = undefined

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
