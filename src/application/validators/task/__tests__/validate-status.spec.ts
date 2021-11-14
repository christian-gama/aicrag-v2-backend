import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateStatus } from '@/application/validators/task'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateStatus
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { status: 'completed' } }

  const sut = new ValidateStatus()

  return { request, sut }
}

describe('validateStatus', () => {
  it('should return InvalidTypeError if status has an invalid type', () => {
    const { sut } = makeSut()
    const data = { status: 123 }

    const result = sut.validate(data)

    expect(result).toStrictEqual(new InvalidTypeError('status', 'string', typeof data.status))
  })

  it('should return InvalidParamError if is an invalid status', () => {
    const { request, sut } = makeSut()
    request.body.status = 'invalid_status'

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('status'))
  })

  it('should return undefined if is a valid status', () => {
    const { request, sut } = makeSut()

    const result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if param is undefined', () => {
    const { sut } = makeSut()
    const data = {}

    const result = sut.validate(data)

    expect(result).toBeUndefined()
  })
})
