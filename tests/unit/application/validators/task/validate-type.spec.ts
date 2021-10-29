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
    const { request, sut } = makeSut()
    request.body.type = 'invalid_type'

    const result = sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('type'))
  })

  it('should return undefined if type is equal to QA or TX', () => {
    const { request, sut } = makeSut()

    let result = sut.validate(request.body)

    expect(result).toBeUndefined()

    request.body.type = 'TX'

    result = sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})
