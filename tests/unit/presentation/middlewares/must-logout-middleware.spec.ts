import { IUser } from '@/domain'

import { MustLogoutError } from '@/application/usecases/errors'

import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { MustLogoutMiddleware } from '@/presentation/middlewares'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  sut: MustLogoutMiddleware
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { user: undefined }

  const sut = new MustLogoutMiddleware(httpHelper)

  return {
    sut,
    fakeUser,
    httpHelper,
    request
  }
}

describe('RefreshToken', () => {
  it('Should return forbidden if user is logged in', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    request.user = fakeUser

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.forbidden(new MustLogoutError()))
  })

  it('Should return ok if user is not logged in', async () => {
    const { sut, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(
      httpHelper.ok({})
    )
  })
})
