import { GenerateTokenProtocol, VerifyTokenProtocol } from '@/application/protocols/providers'
import { InvalidTokenError, MustLogoutError } from '@/application/usecases/errors'
import { IUser } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers'
import { VerifyResetPasswordTokenController } from '@/presentation/controllers/token'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeFakeUser, makeGenerateTokenStub, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: VerifyResetPasswordTokenController
  fakeUser: IUser
  generateAccessTokenStub: GenerateTokenProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  verifyResetPasswordTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const generateAccessTokenStub = makeGenerateTokenStub()
  const httpHelper = makeHttpHelper()
  const request = { params: { token: 'any_token' } }
  const verifyResetPasswordTokenStub = makeVerifyTokenStub()

  const sut = new VerifyResetPasswordTokenController(
    generateAccessTokenStub,
    httpHelper,
    verifyResetPasswordTokenStub
  )

  return {
    sut,
    fakeUser,
    generateAccessTokenStub,
    httpHelper,
    request,
    verifyResetPasswordTokenStub
  }
}

describe('VerifyResetPasswordTokenController', () => {
  it('Should return forbidden if user is logged in', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('Should call verify with correct values', async () => {
    const { sut, request, verifyResetPasswordTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyResetPasswordTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })

  it('Should return unauthorized if return an error', async () => {
    const { sut, httpHelper, request, verifyResetPasswordTokenStub } = makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('Should call generate with correct user', async () => {
    const { sut, fakeUser, generateAccessTokenStub, request, verifyResetPasswordTokenStub } =
      makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const generateSpy = jest.spyOn(generateAccessTokenStub, 'generate')

    await sut.handle(request)

    expect(generateSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should return ok if finds a user', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.ok({ accessToken: 'any_token' }))
  })
})
