import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateTokenVersion } from '@/application/validators/user'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateTokenVersion
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { tokenVersion: 1 } }

  const sut = new ValidateTokenVersion()

  return { request, sut }
}

describe('validateTokenVersion', () => {
  it('should return InvalidTypeError if tokenVersion is not a number', async () => {
    const { request, sut } = makeSut()
    request.body.tokenVersion = '123'

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('tokenVersion', 'number', typeof request.body.tokenVersion))
  })

  it('should return InvalidParamError if tokenVersion is invalid', async () => {
    const { request, sut } = makeSut()
    request.body.tokenVersion = -1

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('tokenVersion'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no tokenVersion', async () => {
    const { request, sut } = makeSut()

    delete request.body.tokenVersion

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})
