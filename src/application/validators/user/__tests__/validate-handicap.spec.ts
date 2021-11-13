import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateHandicap } from '@/application/validators/user'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateHandicap
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { handicap: 1 } }

  const sut = new ValidateHandicap()

  return { request, sut }
}

describe('validateHandicap', () => {
  it('should return InvalidTypeError if handicap is not a number', async () => {
    const { request, sut } = makeSut()
    request.body.handicap = '123'

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('handicap', 'number', typeof request.body.handicap))
  })

  it('should return InvalidParamError if handicap is invalid', async () => {
    const { request, sut } = makeSut()
    request.body.handicap = -1

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('handicap'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no handicap', async () => {
    const { request, sut } = makeSut()

    delete request.body.handicap

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})
