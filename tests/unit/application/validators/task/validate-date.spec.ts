import { InvalidParamError } from '@/application/errors'
import { ValidateDate } from '@/application/validators/task'

import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateDate
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { date: new Date(Date.now()) } }

  const sut = new ValidateDate()

  return { request, sut }
}

describe('validateDate', () => {
  it('should return InvalidParamError if is an invalid date', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()
    request.body.date = 'invalid_date'

    const error = sut.validate(request.body)

    expect(error).toStrictEqual(new InvalidParamError('date'))
  })

  it('should return undefined if is a valid date', () => {
    expect.hasAssertions()

    const { request, sut } = makeSut()

    const response = sut.validate(request.body)

    expect(response).toBeUndefined()
  })
})
