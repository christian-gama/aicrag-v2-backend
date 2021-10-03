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
})
