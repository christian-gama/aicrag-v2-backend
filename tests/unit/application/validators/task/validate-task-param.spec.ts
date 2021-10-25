import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateTaskParam } from '@/application/validators/task'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateTaskParam
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { params: { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx' } }

  const sut = new ValidateTaskParam()

  return { request, sut }
}

describe('validateTaskParam', () => {
  it('should return InvalidTypeError if id is not a string', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.params.id = 123

    const result = sut.validate(request.params)

    expect(result).toStrictEqual(new InvalidTypeError('id'))
  })

  it('should return InvalidParamError if there is no id', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.params.id = undefined

    const result = sut.validate(request.params)

    expect(result).toStrictEqual(new InvalidParamError('id'))
  })

  it('should return InvalidParamError if it is not a valid uuid', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.params.id = 'invalid_id'

    const result = sut.validate(request.params)

    expect(result).toStrictEqual(new InvalidParamError('id'))
  })

  it('should return undefined if succeeds', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    let result = sut.validate(request.params)

    expect(result).toBeUndefined()

    // Test with {12} characters too
    request.params.id = `${request.params.id as string}x`

    result = sut.validate(request.params)

    expect(result).toBeUndefined()
  })
})
