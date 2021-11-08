import { IUser } from '@/domain'
import { IPin } from '@/domain/helpers'
import { IMailerService } from '@/domain/mailer'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MailerServiceError } from '@/application/errors'
import { SendEmailPinController } from '@/presentation/controllers/mailer'
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
  emailPinStub: IMailerService
  fakeUser: IUser
  httpHelper: IHttpHelper
  request: HttpRequest
  sendEmailPinValidatorStub: IValidator
  sut: SendEmailPinController
  userRepositoryStub: IUserRepository
  validationCodeStub: IPin
}

const makeSut = (): SutTypes => {
  const emailPinStub = makeMailerServiceStub()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const sendEmailPinValidatorStub = makeValidatorStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const validationCodeStub = makePinStub()

  const sut = new SendEmailPinController(
    emailPinStub,
    httpHelper,
    sendEmailPinValidatorStub,
    userRepositoryStub,
    validationCodeStub
  )

  return {
    emailPinStub,
    fakeUser,
    httpHelper,
    request,
    sendEmailPinValidatorStub,
    sut,
    userRepositoryStub,
    validationCodeStub
  }
}

describe('sendEmailPinController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call validate with correct data', async () => {
    const { request, sendEmailPinValidatorStub, sut } = makeSut()
    const validateSpy = jest.spyOn(sendEmailPinValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    const { httpHelper, request, sendEmailPinValidatorStub, sut } = makeSut()
    jest.spyOn(sendEmailPinValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call findByEmail with correct email', async () => {
    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should call send with correct user', async () => {
    const { sut, fakeUser, request, emailPinStub } = makeSut()
    const sendSpy = jest.spyOn(emailPinStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call updateById with correct values if the email pin is expired', async () => {
    const { validationCodeStub, fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updatedUserSpy = jest.spyOn(userRepositoryStub, 'updateById')
    fakeUser.temporary.tempEmailPinExpiration = new Date(Date.now() - 10 * 60 * 1000)

    await sut.handle(request)

    expect(updatedUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'temporary.tempEmailPin': validationCodeStub.generate(),
      'temporary.tempEmailPinExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })
  })

  it('should return serverError if mailer fails', async () => {
    const { sut, request, emailPinStub } = makeSut()
    jest.spyOn(emailPinStub, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    const result = await sut.handle(request)

    expect(result.data.error.name).toBe('MailerServiceError')
  })

  it('should return ok if send email', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()
    fakeUser.temporary.tempEmail = 'any_email@mail.com'

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        message: `An email with your pin has been sent to ${fakeUser.temporary.tempEmail}`
      })
    )
  })
})
