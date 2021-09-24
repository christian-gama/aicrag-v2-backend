import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { InvalidTokenError } from '@/application/usecases/errors'
import { makeHttpHelper } from '@/main/factories/helpers'
import { VerifyResetPasswordTokenController } from '@/presentation/controllers/token'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: VerifyResetPasswordTokenController
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  verifyResetPasswordTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const request = { params: { token: 'any_token' } }
  const verifyResetPasswordTokenStub = makeVerifyTokenStub()

  const sut = new VerifyResetPasswordTokenController(httpHelper, verifyResetPasswordTokenStub)

  return { sut, httpHelper, request, verifyResetPasswordTokenStub }
}

describe('VerifyTokenUrlController', () => {
  it('Should call verify with correct values', async () => {
    const { sut, request, verifyResetPasswordTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyResetPasswordTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return unauthorized if return an error', async () => {
    const { sut, httpHelper, request, verifyResetPasswordTokenStub } = makeSut()
    jest.spyOn(verifyResetPasswordTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('Should return ok if finds a user', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ token: 'any_token' }))
  })
})
