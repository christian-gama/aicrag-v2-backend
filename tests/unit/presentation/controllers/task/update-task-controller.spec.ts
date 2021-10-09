import { IUser } from '@/domain'

import { MustLoginError } from '@/application/errors'

import { UpdateTaskController } from '@/presentation/controllers/task'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import { makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdateTaskController
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { params: { id: 'valid_id' }, user: fakeUser }
  const sut = new UpdateTaskController(httpHelper)

  return {
    fakeUser,
    httpHelper,
    request,
    sut
  }
}

describe('updateTaskController', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })
})
