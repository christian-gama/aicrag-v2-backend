import { IUser } from '@/domain'
import { IVerifyToken } from '@/domain/providers'

import { InvalidTokenError, MustLogoutError } from '@/application/errors'

import { VerifyResetPasswordTokenController } from '@/presentation/controllers/token'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import { makeFakeUser, makeVerifyTokenStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: VerifyResetPasswordTokenController
  verifyResetPasswordTokenStub: IVerifyToken
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = { params: { token: 'param_token' } }
  const verifyResetPasswordTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new VerifyResetPasswordTokenController(httpHelper, verifyResetPasswordTokenStub)

  return {
    fakeUser,
    httpHelper,
    request,
    sut,
    verifyResetPasswordTokenStub
  }
}

describe('verifyResetPasswordTokenController', () => {
  it('should return forbidden if user is logged in', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('should call verify with correct values', async () => {
    expect.hasAssertions()

    const { request, sut, verifyResetPasswordTokenStub } = makeSut()
    const verifySpy = jest.spyOn(verifyResetPasswordTokenStub, 'verify')

    await sut.handle(request)

    expect(verifySpy).toHaveBeenCalledWith('param_token')
  })

  it('should return unauthorized if return an error', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, verifyResetPasswordTokenStub } = makeSut()
    jest.spyOn(verifyResetPasswordTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new InvalidTokenError()))
  })

  it('should return ok if finds a user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.ok({ accessToken: 'param_token' }))
  })
})
