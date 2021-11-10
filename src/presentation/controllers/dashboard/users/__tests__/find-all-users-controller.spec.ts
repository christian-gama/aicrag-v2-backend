import { IUser } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { HttpRequest, IHttpHelper } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeUser, makeUserRepositoryStub, makeValidatorStub } from '@/tests/__mocks__'
import { FindAllUsersController } from '../find-all-users-controller'

interface SutTypes {
  fakeUser: IUser
  findAllUsersValidatorStub: IValidator
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: FindAllUsersController
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const findAllUsersValidatorStub = makeValidatorStub()
  const request: HttpRequest = { query: {}, user: fakeUser }

  const sut = new FindAllUsersController(findAllUsersValidatorStub, httpHelper, userRepositoryStub)

  return { fakeUser, findAllUsersValidatorStub, httpHelper, request, sut, userRepositoryStub }
}

describe('FindAllUsersController', () => {
  it('should return unauthorized with MustLoginError if the user is logged out', async () => {
    const { httpHelper, request, sut } = makeSut()

    delete request.user

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest with an error if the findAllUsersValidator fails', async () => {
    const { findAllUsersValidatorStub, httpHelper, request, sut } = makeSut()

    jest.spyOn(findAllUsersValidatorStub, 'validate').mockReturnValueOnce(new Error())

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return ok with a QueryResult if validation succeeds', async () => {
    const { fakeUser, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        count: 1,
        displaying: 1,
        documents: [fakeUser],
        page: '1 of 1'
      })
    )
  })
})
