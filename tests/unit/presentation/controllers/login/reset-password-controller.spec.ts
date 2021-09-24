import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { InvalidTokenError, MustLogoutError } from '@/application/usecases/errors'
import { IUser } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers'
import { ResetPasswordController } from '@/presentation/controllers/login/reset-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeFakeUser, makeUserDbRepositoryStub, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: ResetPasswordController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  userDbRepositoryStub: UserDbRepositoryProtocol
  verifyResetPasswordTokenStub: VerifyTokenProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = {
    accessToken: 'any_token',
    body: { password: 'new_password', passwordConfirmation: 'new_password' }
  }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const verifyResetPasswordTokenStub = makeVerifyTokenStub()

  const sut = new ResetPasswordController(
    httpHelper,
    userDbRepositoryStub,
    verifyResetPasswordTokenStub
  )

  return { sut, fakeUser, httpHelper, request, userDbRepositoryStub, verifyResetPasswordTokenStub }
}

describe('ResetPasswordController', () => {
  it('Should return forbidden if user is logged in', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('Should call verify with correct token', async () => {
    const { sut, request, verifyResetPasswordTokenStub } = makeSut()
    const verifyStub = jest.spyOn(verifyResetPasswordTokenStub, 'verify')

    await sut.handle(request)

    expect(verifyStub).toHaveBeenCalledWith(request.accessToken)
  })

  it('Should return unauthorized if verify fails', async () => {
    const { sut, httpHelper, request, verifyResetPasswordTokenStub } = makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('Should call updateUser with correct values', async () => {
    const { sut, fakeUser, request, userDbRepositoryStub, verifyResetPasswordTokenStub } = makeSut()
    jest
      .spyOn(verifyResetPasswordTokenStub, 'verify')
      .mockReturnValueOnce(Promise.resolve(fakeUser))

    const updateUserStub = jest.spyOn(userDbRepositoryStub, 'updateUser')

    await sut.handle(request)

    expect(updateUserStub).toHaveBeenCalledWith(fakeUser, { 'personal.password': request.body.password })
  })
})
