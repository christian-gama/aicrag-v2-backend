import { IUser } from '@/domain'
import { ITaskRepository } from '@/domain/repositories'
import { IUserRepository } from '@/domain/repositories/user'
import { IValidator } from '@/domain/validators'
import { MustLoginError, UserNotFoundError } from '@/application/errors'
import { DeleteUserController } from '@/presentation/controllers/dashboard/users'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import {
  makeFakeTask,
  makeFakeUser,
  makeTaskRepositoryStub,
  makeUserRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

interface SutTypes {
  deleteUserValidatorStub: IValidator
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sut: DeleteUserController
  taskRepositoryStub: ITaskRepository
  userRepositoryStub: IUserRepository
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { params: { id: 'valid_id' }, user: fakeUser }
  const taskRepositoryStub = makeTaskRepositoryStub(fakeTask)
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const deleteUserValidatorStub = makeValidatorStub()

  const sut = new DeleteUserController(deleteUserValidatorStub, httpHelper, taskRepositoryStub, userRepositoryStub)

  return {
    deleteUserValidatorStub,
    fakeUser,
    httpHelper,
    request,
    sut,
    taskRepositoryStub,
    userRepositoryStub
  }
}

describe('deleteUserController', () => {
  it('should return unauthorized if there is no user', async () => {
    const { httpHelper, request, sut } = makeSut()
    delete request.user

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an error', async () => {
    const { httpHelper, request, sut, deleteUserValidatorStub } = makeSut()
    jest.spyOn(deleteUserValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return badRequest if does not delete a user', async () => {
    const { httpHelper, request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'deleteById').mockReturnValueOnce(Promise.resolve(false))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new UserNotFoundError()))
  })

  it('should call validate with correct data', async () => {
    const { request, sut, deleteUserValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(deleteUserValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.params)
  })

  it('should call delete with correct data', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const deleteTaskSpy = jest.spyOn(userRepositoryStub, 'deleteById')

    await sut.handle(request)

    expect(deleteTaskSpy).toHaveBeenCalledWith(request.params.id)
  })

  it('should call deleteManyByUserId if succeeds', async () => {
    const { request, sut, taskRepositoryStub } = makeSut()
    const deleteManyByUserIdSpy = jest.spyOn(taskRepositoryStub, 'deleteManyByUserId')

    await sut.handle(request)

    expect(deleteManyByUserIdSpy).toHaveBeenCalledWith(request.params.id)
  })

  it('should return deleted if succeeds', async () => {
    const { httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.deleted())
  })
})
