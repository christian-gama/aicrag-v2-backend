import { MustLoginError, PermissionError } from '@/application/errors'
import { IUser } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers'
import { HttpRequest, IHttpHelper } from '@/presentation/http/protocols'
import { makeFakeUser } from '@/tests/__mocks__'
import { PermissionMiddleware } from '..'

interface SutTypes {
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: PermissionMiddleware
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser({ settings: { role: 'administrator' } })
  const httpHelper = makeHttpHelper()
  const request = { user: fakeUser }

  const sut = new PermissionMiddleware(httpHelper, 'administrator')

  return { fakeUser, httpHelper, request, sut }
}

describe('administratorMiddleware', () => {
  it('should return ok if user is an administrator', async () => {
    const { sut, httpHelper, request } = makeSut()

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toStrictEqual(httpHelper.ok({}))
  })

  it('should return unauthorized with MustLoginError if the user is not logged in', async () => {
    const { sut, httpHelper, request } = makeSut()

    delete request.user

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return forbidden with PermissionError if the user is not an administrator', async () => {
    const { sut, httpHelper, request } = makeSut()

    ;(request.user as IUser).settings.role = 'user'

    const httpResponse = await sut.handle(request)

    expect(httpResponse).toStrictEqual(httpHelper.forbidden(new PermissionError()))
  })
})
