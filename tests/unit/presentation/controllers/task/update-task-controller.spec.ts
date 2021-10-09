import { IUser } from '@/domain'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { UpdateTaskController } from '@/presentation/controllers/task'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import { makeFakeUser, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdateTaskController
  validateTaskParamStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { params: { id: 'valid_id' }, user: fakeUser }
  const validateTaskParamStub = makeValidatorStub()

  const sut = new UpdateTaskController(httpHelper, validateTaskParamStub)

  return {
    fakeUser,
    httpHelper,
    request,
    sut,
    validateTaskParamStub
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

  it('should return badRequest if param is invalid', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, validateTaskParamStub } = makeSut()
    jest.spyOn(validateTaskParamStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new Error()))
  })
})
