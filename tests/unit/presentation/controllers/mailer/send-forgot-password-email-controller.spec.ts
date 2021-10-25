import { IUser } from '@/domain'
import { IMailerService } from '@/domain/mailer'
import { IGenerateToken, IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { InvalidTokenError, MailerServiceError } from '@/application/errors'

import { SendForgotPasswordEmailController } from '@/presentation/controllers/mailer'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

import {
  makeFakeUser,
  makeValidatorStub,
  makeUserRepositoryStub,
  makeMailerServiceStub,
  makeVerifyTokenStub,
  makeGenerateTokenStub
} from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  forgotPasswordEmailStub: IMailerService
  forgotPasswordValidatorStub: IValidator
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: SendForgotPasswordEmailController
  userRepositoryStub: IUserRepository
  generateAccessTokenStub: IGenerateToken
  verifyResetPasswordTokenStub: IVerifyToken
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const forgotPasswordEmailStub = makeMailerServiceStub()
  const forgotPasswordValidatorStub = makeValidatorStub()
  const generateAccessTokenStub = makeGenerateTokenStub()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const verifyResetPasswordTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new SendForgotPasswordEmailController(
    forgotPasswordEmailStub,
    forgotPasswordValidatorStub,
    generateAccessTokenStub,
    httpHelper,
    userRepositoryStub,
    verifyResetPasswordTokenStub
  )

  return {
    fakeUser,
    forgotPasswordEmailStub,
    forgotPasswordValidatorStub,
    generateAccessTokenStub,
    httpHelper,
    request,
    sut,
    userRepositoryStub,
    verifyResetPasswordTokenStub
  }
}

describe('sendForgotPasswordEmail', () => {
  it('should call validate with correct data', async () => {
    expect.hasAssertions()

    const { forgotPasswordValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(forgotPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { forgotPasswordValidatorStub, httpHelper, request, sut } = makeSut()
    jest.spyOn(forgotPasswordValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const result = await sut.handle(request)

    expect(result).toStrictEqual(httpHelper.badRequest(new Error()))
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

    const { fakeUser, forgotPasswordEmailStub, request, sut } = makeSut()
    const sendSpy = jest.spyOn(forgotPasswordEmailStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return serverError if mailer fails', async () => {
    expect.hasAssertions()

    const { forgotPasswordEmailStub, request, sut } = makeSut()
    jest.spyOn(forgotPasswordEmailStub, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    const result = await sut.handle(request)

    expect(result.data.error.name).toBe('MailerServiceError')
  })

  it('should call updateUser with correct values if the reset token is no longer valid', async () => {
    expect.hasAssertions()

    const { fakeUser, request, sut, userRepositoryStub, verifyResetPasswordTokenStub } = makeSut()
    const updatedUserSpy = jest.spyOn(userRepositoryStub, 'updateUser')
    fakeUser.temporary.resetPasswordToken = null
    jest.spyOn(verifyResetPasswordTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    await sut.handle(request)

    expect(updatedUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'temporary.resetPasswordToken': 'any_token'
    })
  })

  it('should return ok if send email', async () => {
    expect.hasAssertions()

    const { fakeUser, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        message: `Instructions to reset your password were sent to ${fakeUser.personal.email}`
      })
    )
  })
})
