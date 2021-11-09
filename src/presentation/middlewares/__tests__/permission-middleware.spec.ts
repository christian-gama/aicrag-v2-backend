import { PermissionError } from '@/application/errors'
import { IUser, IUserRole } from '@/domain'
import { makeHttpHelper } from '@/main/factories/helpers'
import { HttpRequest, IHttpHelper } from '@/presentation/http/protocols'
import { makeFakeUser } from '@/tests/__mocks__'
import { PermissionMiddleware } from '..'

interface SutTypes {
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser({ settings: { role: IUserRole.administrator } })
  const httpHelper = makeHttpHelper()
  const request = { user: fakeUser }

  return { fakeUser, httpHelper, request }
}

describe('permissionMiddleware', () => {
  describe('administratorMiddleware', () => {
    const { httpHelper, request } = makeSut()
    const sut = new PermissionMiddleware(httpHelper, IUserRole.administrator)

    it('should return ok if user is an administrator and permission requires administrator', async () => {
      const httpResponse = await sut.handle(request)

      expect(httpResponse).toStrictEqual(httpHelper.ok({}))
    })

    it('should return forbidden with PermissionError if permission requests an administrator but user has lower permission', async () => {
      const { httpHelper, request } = makeSut()

      ;(request.user as IUser).settings.role = IUserRole.guest

      const httpResponse = await sut.handle(request)

      expect(httpResponse).toStrictEqual(httpHelper.forbidden(new PermissionError()))
    })
  })

  describe('moderatorMiddleware', () => {
    const { httpHelper, request } = makeSut()
    const sut = new PermissionMiddleware(httpHelper, IUserRole.moderator)

    it('should return ok if user is a moderator and permission requires moderator', async () => {
      const httpResponse = await sut.handle(request)

      expect(httpResponse).toStrictEqual(httpHelper.ok({}))
    })

    it('should return forbidden with PermissionError if permission requests an moderator but user has lower permission', async () => {
      const { httpHelper, request } = makeSut()

      ;(request.user as IUser).settings.role = IUserRole.guest

      const httpResponse = await sut.handle(request)

      expect(httpResponse).toStrictEqual(httpHelper.forbidden(new PermissionError()))
    })
  })

  describe('userMiddleware', () => {
    const { httpHelper, request } = makeSut()
    const sut = new PermissionMiddleware(httpHelper, IUserRole.user)

    it('should return ok if user is a user and permission requires user', async () => {
      const httpResponse = await sut.handle(request)

      expect(httpResponse).toStrictEqual(httpHelper.ok({}))
    })

    it('should return forbidden with PermissionError if permission requests an user but user has lower permission', async () => {
      const { httpHelper, request } = makeSut()

      ;(request.user as IUser).settings.role = IUserRole.guest

      const httpResponse = await sut.handle(request)

      expect(httpResponse).toStrictEqual(httpHelper.forbidden(new PermissionError()))
    })
  })

  describe('guestMiddleware', () => {
    const { httpHelper, request } = makeSut()
    const sut = new PermissionMiddleware(httpHelper, IUserRole.guest)

    it('should return ok if user is a guest and permission requires guest', async () => {
      const httpResponse = await sut.handle(request)

      expect(httpResponse).toStrictEqual(httpHelper.ok({}))
    })
  })
})
