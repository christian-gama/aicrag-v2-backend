import { IUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'
import { MustLoginError } from '@/application/errors'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeUser, makeFilterUserDataStub } from '@/tests/__mocks__'
import { GetMeController } from '../get-me-controller'

interface SutTypes {
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: GetMeController
  filterUserDataStub: IFilterUserData
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = {
    headers: { 'x-access-token': 'any_token', 'x-refresh-token': 'any_token' },
    user: fakeUser
  }
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)

  const sut = new GetMeController(httpHelper, filterUserDataStub)

  return { fakeUser, filterUserDataStub, httpHelper, request, sut }
}

describe('getMeController', () => {
  it('should return MustLoginError if user is not logged in', async () => {
    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.forbidden(new MustLoginError()))
  })

  it('should return ok if succeeds', async () => {
    const { httpHelper, request, sut, filterUserDataStub, fakeUser } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({ accessToken: 'any_token', refreshToken: 'any_token', user: filterUserDataStub.filter(fakeUser) })
    )
  })
})
