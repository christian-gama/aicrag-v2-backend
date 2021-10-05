import { IUser } from '@/domain'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { CreateTaskController } from '@/presentation/controllers/task'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import { makeFakeUser, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  createTaskValidatorStub: ValidatorProtocol
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: CreateTaskController
}

const makeSut = (): SutTypes => {
  const createTaskValidatorStub = makeValidatorStub()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: {}, user: fakeUser }

  const sut = new CreateTaskController(createTaskValidatorStub, httpHelper)

  return { createTaskValidatorStub, fakeUser, httpHelper, request, sut }
}

describe('createTaskController', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, createTaskValidatorStub } = makeSut()
    jest
      .spyOn(createTaskValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new Error()))
  })
})
