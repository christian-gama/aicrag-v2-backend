import { ITask, IUser } from '@/domain'
import { InvoiceRepositoryProtocol } from '@/domain/repositories/invoice'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { GetInvoiceByMonthController } from '@/presentation/controllers/invoice'
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
  httpHelper: HttpHelperProtocol
  queryInvoiceValidator: ValidatorProtocol
  request: HttpRequest
  sut: GetInvoiceByMonthController
  invoiceRepository: InvoiceRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const invoiceRepository = makeInvoiceRepositoryStub(fakeTask)
  const queryInvoiceValidator = makeValidatorStub()
  const request: HttpRequest = { query: { month: '0', year: '2021' }, user: fakeUser }

  const sut = new GetInvoiceByMonthController(httpHelper, invoiceRepository, queryInvoiceValidator)

  return {
    fakeTask,
    fakeUser,
    httpHelper,
    invoiceRepository,
    queryInvoiceValidator,
    request,
    sut
  }
}

describe('getInvoiceByMonth', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an error', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, queryInvoiceValidator } = makeSut()
    jest.spyOn(queryInvoiceValidator, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const error = await sut.handle(request)

    expect(error).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return ok if does not find a task', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, invoiceRepository } = makeSut()
    jest
      .spyOn(invoiceRepository, 'getInvoiceByMonth')
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

    const { request, sut, queryInvoiceValidator } = makeSut()
    const validateSpy = jest.spyOn(queryInvoiceValidator, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.query)
  })

  it('should call getInvoiceByMonth with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, invoiceRepository } = makeSut()
    const getInvoiceByMonthSpy = jest.spyOn(invoiceRepository, 'getInvoiceByMonth')

    await sut.handle(request)

    expect(getInvoiceByMonthSpy).toHaveBeenCalledWith(request.query, request.user?.personal.id)
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
