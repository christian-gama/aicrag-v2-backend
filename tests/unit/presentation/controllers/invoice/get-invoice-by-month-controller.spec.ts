import { ITask, IUser } from '@/domain'
import { IInvoiceRepository } from '@/domain/repositories/invoice'
import { IValidator } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { GetInvoiceByMonthController } from '@/presentation/controllers/invoice'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import { makeFakeTask, makeFakeUser, makeInvoiceRepositoryStub, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeTask: ITask
  fakeUser: IUser
  getInvoiceByMonthValidator: IValidator
  httpHelper: HttpHelperProtocol
  invoiceRepository: IInvoiceRepository
  request: HttpRequest
  sut: GetInvoiceByMonthController
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakeTask = makeFakeTask(fakeUser)
  const httpHelper = makeHttpHelper()
  const invoiceRepository = makeInvoiceRepositoryStub(fakeTask)
  const getInvoiceByMonthValidator = makeValidatorStub()
  const request: HttpRequest = { query: { month: '0', year: '2021' }, user: fakeUser }

  const sut = new GetInvoiceByMonthController(getInvoiceByMonthValidator, httpHelper, invoiceRepository)

  return {
    fakeTask,
    fakeUser,
    getInvoiceByMonthValidator,
    httpHelper,
    invoiceRepository,
    request,
    sut
  }
}

describe('getByMonth', () => {
  it('should return unauthorized if there is no user', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()
    request.user = undefined

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.unauthorized(new MustLoginError()))
  })

  it('should return badRequest if validation returns an error', async () => {
    expect.hasAssertions()

    const { getInvoiceByMonthValidator, httpHelper, request, sut } = makeSut()
    jest.spyOn(getInvoiceByMonthValidator, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return ok if does not find a task', async () => {
    expect.hasAssertions()

    const { httpHelper, invoiceRepository, request, sut } = makeSut()
    jest
      .spyOn(invoiceRepository, 'getByMonth')
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
    expect.hasAssertions()

    const { getInvoiceByMonthValidator, request, sut } = makeSut()
    const validateSpy = jest.spyOn(getInvoiceByMonthValidator, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.query)
  })

  it('should call getByMonth with correct data', async () => {
    expect.hasAssertions()

    const { request, sut, invoiceRepository } = makeSut()
    const getInvoiceByMonthSpy = jest.spyOn(invoiceRepository, 'getByMonth')

    await sut.handle(request)

    expect(getInvoiceByMonthSpy).toHaveBeenCalledWith(request.query, request.user?.personal.id)
  })

  it('should return ok with correct task if succeeds', async () => {
    expect.hasAssertions()

    const { fakeTask, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })
    )
  })
})
