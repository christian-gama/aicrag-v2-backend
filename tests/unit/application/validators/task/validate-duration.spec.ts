import { InvalidParamError } from '@/application/errors'
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
  it('should return InvalidParamError if type is TX and duration is longer than 30', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.duration = 31

    const error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return InvalidParamError if type is TX and duration is lesser equal to 0', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.duration = 0

    let error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('duration'))

    request.body.duration = -1

    error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return undefined if type is TX and duration is equal to 30', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const response = sut.validate(request.body)

    expect(response).toBeUndefined()
  })

  it('should return InvalidParamError if type is QA and duration is longer than 2.5', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.duration = 2.6
    request.body.type = 'QA'

    const error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return InvalidParamError if type is QA and duration is lesser equal to 0', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.duration = 0
    request.body.type = 'QA'

    let error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('duration'))

    request.body.duration = -1

    error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('duration'))
  })

  it('should return undefined if type is QA and duration is equal to 2.5', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.duration = 2.5
    request.body.type = 'QA'

    const response = sut.validate(request.body)

    expect(response).toBeUndefined()
  })
})
