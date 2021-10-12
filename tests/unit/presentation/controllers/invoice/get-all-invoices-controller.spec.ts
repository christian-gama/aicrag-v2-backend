import { ITask, IUser } from '@/domain'
import { InvoiceRepositoryProtocol } from '@/domain/repositories/invoice'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { GetAllInvoicesController } from '@/presentation/controllers/invoice'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeTask,
  makeFakeUser,
  makeInvoiceRepositoryStub,
  makeValidatorStub
} from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  getAllInvoicesValidatorStub: ValidatorProtocol
  httpHelper: HttpHelperProtocol
  invoiceRepositoryStub: InvoiceRepositoryProtocol
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

  const sut = new GetAllInvoicesController(
    getAllInvoicesValidatorStub,
    httpHelper,
    invoiceRepositoryStub
  )

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

describe('getAllInvoices', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an error', async () => {
    expect.hasAssertions()

    const { getAllInvoicesValidatorStub, httpHelper, request, sut } = makeSut()
    jest
      .spyOn(getAllInvoicesValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return ok if does not find a task', async () => {
    expect.hasAssertions()

    const { httpHelper, invoiceRepositoryStub, request, sut } = makeSut()
    jest
      .spyOn(invoiceRepositoryStub, 'getAllInvoices')
      .mockReturnValueOnce(
        Promise.resolve({ count: 1, displaying: 1, documents: [], page: '1 of 1' })
      )

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({
        count: 1,
        displaying: 1,
        documents: [],
        page: '1 of 1'
      })
    )
  })

  it('should call validate with correct data', async () => {
    expect.hasAssertions()

    const { getAllInvoicesValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(getAllInvoicesValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.query)
  })

  it('should call getAllInvoices with correct data', async () => {
    expect.hasAssertions()

    const { invoiceRepositoryStub, request, sut } = makeSut()
    const getAllInvoicesSpy = jest.spyOn(invoiceRepositoryStub, 'getAllInvoices')

    await sut.handle(request)

    expect(getAllInvoicesSpy).toHaveBeenCalledWith(request.query, request.user?.personal.id)
  })

  it('should return ok with correct task if succeeds', async () => {
    expect.hasAssertions()

    const { fakeTask, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })
    )
  })
})
