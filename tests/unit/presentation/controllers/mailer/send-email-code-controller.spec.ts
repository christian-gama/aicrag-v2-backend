import { IUser } from '@/domain'
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
  makeMailerServiceStub
} from '@/tests/__mocks__'

interface SutTypes {
  emailCodeStub: MailerServiceProtocol
  sendEmailCodeValidatorStub: ValidatorProtocol
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: SendEmailCodeController
  userRepositoryStub: UserRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const emailCodeStub = makeMailerServiceStub()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const sendEmailCodeValidatorStub = makeValidatorStub()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)

  const sut = new SendEmailCodeController(
    emailCodeStub,
    httpHelper,
    sendEmailCodeValidatorStub,
    userRepositoryStub
  )

  return {
    emailCodeStub,
    fakeUser,
    httpHelper,
    request,
    sendEmailCodeValidatorStub,
    sut,
    userRepositoryStub
  }
}

describe('sendEmailCodeController', () => {
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
