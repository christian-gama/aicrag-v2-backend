import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateDuration } from '@/application/validators/task'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateDuration
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { duration: 30, type: 'TX' } }

  const sut = new ValidateDuration()

  return { request, sut }
}

describe('validateDuration', () => {
  it('should return InvalidTypeError if duration is not a number', () => {
    const { request, sut } = makeSut()
    request.body.duration = '123'

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('duration'))
  })

  it('should return InvalidParamError if type is TX and duration is longer than 30', () => {
    const { request, sut } = makeSut()
    request.body.duration = 31

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return InvalidParamError if type is TX and duration is lesser equal to 0', () => {
    const { request, sut } = makeSut()
    request.body.duration = 0

    let result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('duration'))

    request.body.duration = -1

    result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return undefined if type is TX and duration is equal to 30', () => {
    const { request, sut } = makeSut()

    const response = sut.validate(request.body)

    expect(response).toBeUndefined()
  })

  it('should return InvalidParamError if type is QA and duration is longer than 2.5', () => {
    const { request, sut } = makeSut()
    request.body.duration = 2.6
    request.body.type = 'QA'

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return InvalidParamError if type is QA and duration is lesser equal to 0', () => {
    const { request, sut } = makeSut()
    request.body.duration = 0
    request.body.type = 'QA'

    let result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('duration'))

    request.body.duration = -1

    result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return undefined if type is QA and duration is equal to 2.5', () => {
    const { request, sut } = makeSut()
    request.body.duration = 2.5
    request.body.type = 'QA'

    const response = sut.validate(request.body)

    expect(response).toBeUndefined()
  })
})
