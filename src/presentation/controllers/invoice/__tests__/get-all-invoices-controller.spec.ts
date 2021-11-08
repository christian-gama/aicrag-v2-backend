import { ITask, IUser } from '@/domain'
import { IInvoiceRepository } from '@/domain/repositories/invoice'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { GetAllInvoicesController } from '@/presentation/controllers/invoice'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeFakeTask, makeFakeUser, makeInvoiceRepositoryStub, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  getAllInvoicesValidatorStub: IValidator
  httpHelper: IHttpHelper
  invoiceRepositoryStub: IInvoiceRepository
  request: HttpRequest
  sut: GetAllInvoicesController
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const invoiceRepositoryStub = makeInvoiceRepositoryStub(fakeTask)
  const getAllInvoicesValidatorStub = makeValidatorStub()
  const request: HttpRequest = { query: { type: 'TX' }, user: fakeUser }

  const sut = new GetAllInvoicesController(getAllInvoicesValidatorStub, httpHelper, invoiceRepositoryStub)

  return {
    fakeTask,
    fakeUser,
    getAllInvoicesValidatorStub,
    httpHelper,
    invoiceRepositoryStub,
    request,
    sut
  }
}

describe('getAll', () => {
  it('should return unauthorized if there is no user', async () => {
    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an result', async () => {
    const { getAllInvoicesValidatorStub, httpHelper, request, sut } = makeSut()
    jest.spyOn(getAllInvoicesValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return ok if does not find a task', async () => {
    const { httpHelper, invoiceRepositoryStub, request, sut } = makeSut()
    jest
      .spyOn(invoiceRepositoryStub, 'getAll')
      .mockReturnValueOnce(Promise.resolve({ count: 1, displaying: 1, documents: [], page: '1 of 1' }))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        count: 1,
        displaying: 1,
        documents: [],
        page: '1 of 1'
      })
    )
  })

  it('should call validate with correct data', async () => {
    const { getAllInvoicesValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(getAllInvoicesValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.query)
  })

  it('should call getAll with correct data', async () => {
    const { invoiceRepositoryStub, request, sut } = makeSut()
    const getAllInvoicesSpy = jest.spyOn(invoiceRepositoryStub, 'getAll')

    await sut.handle(request)

    expect(getAllInvoicesSpy).toHaveBeenCalledWith(request.query, request.user?.personal.id)
  })

  it('should return ok with correct task if succeeds', async () => {
    const { fakeTask, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({
        count: 1,
        displaying: 1,
        documents: [
          {
            date: { month: fakeTask.date.month, year: fakeTask.date.year },
            tasks: 1,
            totalUsd: fakeTask.usd
          }
        ],
        page: '1 of 1'
      })
    )
  })
})
