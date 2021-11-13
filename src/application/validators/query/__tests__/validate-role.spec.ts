import { InvalidParamError, InvalidTypeError } from '@/application/errors'
import { ValidateRole } from '@/application/validators/query'
import { HttpRequest } from '@/presentation/http/protocols'

interface SutTypes {
  request: HttpRequest
  sut: ValidateRole
}
const makeSut = (): SutTypes => {
  const request: HttpRequest = { query: { role: 'administrator' } }

  const sut = new ValidateRole()

  return { request, sut }
}

describe('validateRole', () => {
  it('should return InvalidTypeError if role is not a string', async () => {
    const { request, sut } = makeSut()
    request.query.role = 123

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidTypeError('role', 'string', typeof request.query.role))
  })

  it('should return InvalidParamError if role is invalid', async () => {
    const { request, sut } = makeSut()
    request.query.role = 'invalid_role'

    const result = await sut.validate(request.query)

    expect(result).toStrictEqual(new InvalidParamError('role'))
  })

  it('should return undefined if succeeds', async () => {
    const { request, sut } = makeSut()

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })

  it('should return undefined if there is no role', async () => {
    const { request, sut } = makeSut()

    delete request.query.role

    const result = await sut.validate(request.query)

    expect(result).toBeUndefined()
  })
})
