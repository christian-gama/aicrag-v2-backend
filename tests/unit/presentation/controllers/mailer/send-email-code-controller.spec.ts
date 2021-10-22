import { IUser } from '@/domain'
import { ValidationCodeProtocol } from '@/domain/helpers'
import { MailerServiceProtocol } from '@/domain/mailer'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MailerServiceError } from '@/application/errors'

import { SendEmailCodeController } from '@/presentation/controllers/mailer'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeUser,
  makeValidatorStub,
  makeUserRepositoryStub,
  makeMailerServiceStub,
  makeValidationCodeStub
} from '@/tests/__mocks__'

import MockDate from 'mockdate'

interface SutTypes {
  emailCodeStub: MailerServiceProtocol
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sendEmailCodeValidatorStub: ValidatorProtocol
  sut: SendEmailCodeController
  userRepositoryStub: UserRepositoryProtocol
  validationCodeStub: ValidationCodeProtocol
}

const makeSut = (): SutTypes => {
  const emailCodeStub = makeMailerServiceStub()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const sendEmailCodeValidatorStub = makeValidatorStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const validationCodeStub = makeValidationCodeStub()

  const sut = new SendEmailCodeController(
    emailCodeStub,
    httpHelper,
    sendEmailCodeValidatorStub,
    userRepositoryStub,
    validationCodeStub
  )

  return {
    emailCodeStub,
    fakeUser,
    httpHelper,
    request,
    sendEmailCodeValidatorStub,
    sut,
    userRepositoryStub,
    validationCodeStub
  }
}

describe('sendEmailCodeController', () => {
  afterAll(() => {
    MockDate.reset()
  })

  beforeAll(() => {
    MockDate.set(new Date())
  })

  it('should call validate with correct data', async () => {
    expect.hasAssertions()

    const { request, sendEmailCodeValidatorStub, sut } = makeSut()
    const validateSpy = jest.spyOn(sendEmailCodeValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sendEmailCodeValidatorStub, sut } = makeSut()
    jest
      .spyOn(sendEmailCodeValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should call send with correct user', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, request, emailCodeStub } = makeSut()
    const sendSpy = jest.spyOn(emailCodeStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should call updateUser with correct values if the email code is expired', async () => {
    expect.hasAssertions()

    const { validationCodeStub, fakeUser, request, sut, userRepositoryStub } = makeSut()
    const updatedUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')
    fakeUser.temporary.tempEmailCodeExpiration = new Date(Date.now() - 10 * 60 * 1000)

    await sut.handle(request)

    expect(updatedUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'temporary.tempEmailCode': validationCodeStub.generate(),
      'temporary.tempEmailCodeExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })
  })

  it('should return serverError if mailer fails', async () => {
    expect.hasAssertions()

    const { sut, request, emailCodeStub } = makeSut()
    jest.spyOn(emailCodeStub, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    const response = await sut.handle(request)

    expect(response.data.error.name).toBe('MailerServiceError')
  })

  it('should return ok if send email', async () => {
    expect.hasAssertions()

    const { sut, fakeUser, httpHelper, request } = makeSut()
    fakeUser.temporary.tempEmail = 'any_email@mail.com'

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({
        message: `An email with your code has been sent to ${fakeUser.temporary.tempEmail}`
      })
    )
  })
})
