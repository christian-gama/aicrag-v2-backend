import { IUser } from '@/domain'
import { IPin } from '@/domain/helpers'
import { IMailerService } from '@/domain/mailer'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { AccountAlreadyActivatedError, MailerServiceError } from '@/application/errors'
import { SendWelcomeEmailController } from '@/presentation/controllers/mailer/send-welcome-email-controller'
import { IHttpHelper, HttpRequest } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'
import {
  makeFakeUser,
  makeValidatorStub,
  makeUserRepositoryStub,
  makeMailerServiceStub,
  makePinStub
} from '@/tests/__mocks__'
import MockDate from 'mockdate'

interface SutTypes {
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sendWelcomeValidatorStub: IValidator
  sut: SendWelcomeEmailController
  userRepositoryStub: IUserRepository
  validationCodeStub: IPin
  welcomeEmailStub: IMailerService
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const sendWelcomeValidatorStub = makeValidatorStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const welcomeEmailStub = makeMailerServiceStub()
  const validationCodeStub = makePinStub()

  const sut = new SendWelcomeEmailController(
    httpHelper,
    sendWelcomeValidatorStub,
    userRepositoryStub,
    validationCodeStub,
    welcomeEmailStub
  )

  return {
    fakeUser,
    httpHelper,
    request,
    sendWelcomeValidatorStub,
    sut,
    userRepositoryStub,
    validationCodeStub,
    welcomeEmailStub
  }
}

describe('sendWelcomeEmailController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call validate with correct data', async () => {
    const { request, sendWelcomeValidatorStub, sut } = makeSut()
    const validateSpy = jest.spyOn(sendWelcomeValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    const { httpHelper, request, sendWelcomeValidatorStub, sut } = makeSut()
    jest.spyOn(sendWelcomeValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return forbidden if account is already activated', async () => {
    const { fakeUser, httpHelper, request, sut, userRepositoryStub } = makeSut()
    jest.spyOn(userRepositoryStub, 'findByEmail').mockImplementationOnce(async () => {
      fakeUser.settings.accountActivated = true

      return fakeUser
    })

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.forbidden(new AccountAlreadyActivatedError()))
  })

  it('should call findByEmail with correct email', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should call send with correct user', async () => {
    const { sut, fakeUser, request, welcomeEmailStub } = makeSut()
    const sendSpy = jest.spyOn(welcomeEmailStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return serverError if mailer fails', async () => {
    const { sut, request, welcomeEmailStub } = makeSut()
    jest.spyOn(welcomeEmailStub, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    const result = await sut.handle(request)

    expect(result.data.error.name).toBe('MailerServiceError')
  })

  it('should call updateById with correct values if activation pin has expired', async () => {
    const { fakeUser, request, sut, userRepositoryStub, validationCodeStub } = makeSut()
    const updatedUserSpy = jest.spyOn(userRepositoryStub, 'updateById')
    fakeUser.temporary.activationPinExpiration = new Date(Date.now() - 10 * 60 * 1000)

    await sut.handle(request)

    expect(updatedUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'temporary.activationPin': validationCodeStub.generate(),
      'temporary.activationPinExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })
  })

  it('should return ok if send email', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        message: `A welcome email with activation pin has been sent to ${fakeUser.personal.email}`
      })
    )
  })
})
