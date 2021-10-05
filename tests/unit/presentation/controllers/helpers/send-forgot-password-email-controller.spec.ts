import { IUser } from '@/domain'
import { MailerServiceProtocol } from '@/domain/mailer'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MailerServiceError } from '@/application/errors'

import { SendForgotPasswordEmailController } from '@/presentation/controllers/helpers'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeUser,
  makeValidatorStub,
  makeUserDbRepositoryStub,
  makeMailerServiceStub
} from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  forgotPasswordEmailStub: MailerServiceProtocol
  forgotPasswordValidatorStub: ValidatorProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: SendForgotPasswordEmailController
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const forgotPasswordEmailStub = makeMailerServiceStub()
  const forgotPasswordValidatorStub = makeValidatorStub()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new SendForgotPasswordEmailController(
    forgotPasswordEmailStub,
    forgotPasswordValidatorStub,
    httpHelper,
    userDbRepositoryStub
  )

  return {
    fakeUser,
    forgotPasswordEmailStub,
    forgotPasswordValidatorStub,
    httpHelper,
    request,
    sut,
    userDbRepositoryStub
  }
}

describe('sendForgotPasswordEmail', () => {
  it('should call validate with correct credentials', async () => {
    expect.hasAssertions()

    const { forgotPasswordValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(forgotPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { forgotPasswordValidatorStub, httpHelper, request, sut } = makeSut()
    jest
      .spyOn(forgotPasswordValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call findUserByEmail with correct email', async () => {
    expect.hasAssertions()

    const { request, sut, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('should call send with correct user', async () => {
    expect.hasAssertions()

    const { fakeUser, forgotPasswordEmailStub, request, sut } = makeSut()
    const sendSpy = jest.spyOn(forgotPasswordEmailStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return serverError if mailer fails', async () => {
    expect.hasAssertions()

    const { forgotPasswordEmailStub, request, sut } = makeSut()
    jest
      .spyOn(forgotPasswordEmailStub, 'send')
      .mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    const response = await sut.handle(request)

    expect(response.data.error.name).toBe('MailerServiceError')
  })

  it('should return ok if send email', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(
      httpHelper.ok({
        message: `Instructions to reset your password were sent to ${fakeUser.personal.email}`
      })
    )
  })
})
