import { InvalidParamError } from '@/application/errors'
import { ValidateType } from '@/application/validators/task'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateType
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = {
    body: { type: 'QA' }
  }
  const sut = new ValidateType()

  return { request, sut }
}

describe('validateType', () => {
  it('should return InvalidParamError if type is different from QA and TX', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.type = 'invalid_type'

    const error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('type'))
  })
})
