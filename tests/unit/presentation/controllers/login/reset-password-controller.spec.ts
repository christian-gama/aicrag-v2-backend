import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { MustLogoutError } from '@/application/usecases/errors'
import { IUser } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers'
import { ResetPasswordController } from '@/presentation/controllers/login/reset-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ResetPasswordController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  verifyAccessTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = { accessToken: 'any_token', body: { password: 'new_password', passwordConfirmation: 'new_password' } }
  const verifyAccessTokenStub = makeVerifyTokenStub()

  const sut = new ResetPasswordController(httpHelper, verifyAccessTokenStub)

  return { sut, fakeUser, httpHelper, request, verifyAccessTokenStub }
}

describe('ResetPasswordController', () => {
  it('Should return forbidden if user is logged in', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('Should call verify with correct token', async () => {
    const { sut, request, verifyAccessTokenStub } = makeSut()
    const verifyStub = jest.spyOn(verifyAccessTokenStub, 'verify')

    await sut.handle(request)

    expect(verifyStub).toHaveBeenCalledWith(request.accessToken)
  })
})
