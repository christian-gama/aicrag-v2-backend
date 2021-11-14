import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateAccountStatus } from '@/application/validators/user'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateAccountStatus
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { body: { accountStatus: 'active' } }

  const sut = new ValidateAccountStatus()

  return { request, sut }
}

describe('validateAccountStatus', () => {
  it('should return InvalidTypeError if accountStatus is not a string', async () => {
    const { request, sut } = makeSut()
    request.body.accountStatus = 123

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidTypeError('accountStatus', 'string', typeof request.body.accountStatus))
  })

  it('should return InvalidParamError if accountStatus is invalid', async () => {
    const { request, sut } = makeSut()
    request.body.accountStatus = 'invalid_status'

    const result = await sut.validate(request.body)

    expect(result).toStrictEqual(new InvalidParamError('accountStatus'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no accountStatus', async () => {
    const { request, sut } = makeSut()

    delete request.body.accountStatus

    const result = await sut.validate(request.body)

    expect(result).toBeUndefined()
  })
})
