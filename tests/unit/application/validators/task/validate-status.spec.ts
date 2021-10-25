import { InvalidParamError } from '@/application/errors'
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
  it('should return InvalidParamError if is an invalid status', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.status = 'invalid_status'

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('status'))
  })

  it('should return undefined if is a valid status', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})
