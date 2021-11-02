import { IUser } from '@/domain'
import { IMailerService } from '@/domain/mailer'
import { IGenerateToken, IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { InvalidTokenError, MailerServiceError } from '@/application/errors'

import { SendRecoverPasswordController } from '@/presentation/controllers/mailer'
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
  generateAccessTokenStub: IGenerateToken
  httpHelper: HttpHelperProtocol
  recoverPasswordValidatorStub: IValidator
  request: HttpRequest
  sut: SendRecoverPasswordController
  userRepositoryStub: IUserRepository
  verifyResetPasswordTokenStub: IVerifyToken
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const forgotPasswordEmailStub = makeMailerServiceStub()
  const generateAccessTokenStub = makeGenerateTokenStub()
  const httpHelper = makeHttpHelper()
  const recoverPasswordValidatorStub = makeValidatorStub()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const verifyResetPasswordTokenStub = makeVerifyTokenStub(fakeUser)

  const sut = new SendRecoverPasswordController(
    forgotPasswordEmailStub,
    recoverPasswordValidatorStub,
    generateAccessTokenStub,
    httpHelper,
    userRepositoryStub,
    verifyResetPasswordTokenStub
  )

  return {
    fakeUser,
    forgotPasswordEmailStub,
    generateAccessTokenStub,
    httpHelper,
    recoverPasswordValidatorStub,
    request,
    sut,
    userRepositoryStub,
    verifyResetPasswordTokenStub
  }
}

describe('sendRecoverPasswordEmail', () => {
  it('should call validate with correct data', async () => {
    const { recoverPasswordValidatorStub, request, sut } = makeSut()
    const validateSpy = jest.spyOn(recoverPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    const { recoverPasswordValidatorStub, httpHelper, request, sut } = makeSut()
    jest.spyOn(recoverPasswordValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

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
    const { fakeUser, forgotPasswordEmailStub, request, sut } = makeSut()
    const sendSpy = jest.spyOn(forgotPasswordEmailStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('should return serverError if mailer fails', async () => {
    const { forgotPasswordEmailStub, request, sut } = makeSut()
    jest.spyOn(forgotPasswordEmailStub, 'send').mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    const result = await sut.handle(request)

    expect(result.data.error.name).toBe('MailerServiceError')
  })

  it('should call updateById with correct values if the reset token is no longer valid', async () => {
    const { fakeUser, request, sut, userRepositoryStub, verifyResetPasswordTokenStub } = makeSut()
    const updatedUserSpy = jest.spyOn(userRepositoryStub, 'updateById')
    fakeUser.temporary.resetPasswordToken = null
    jest.spyOn(verifyResetPasswordTokenStub, 'verify').mockReturnValueOnce(Promise.resolve(new InvalidTokenError()))

    await sut.handle(request)

    expect(updatedUserSpy).toHaveBeenCalledWith(fakeUser.personal.id, {
      'temporary.resetPasswordToken': 'any_token'
    })
  })

  it('should return ok if send email', async () => {
    const { fakeUser, httpHelper, request, sut } = makeSut()

    const result = await sut.handle(request)

    expect(result).toStrictEqual(
      httpHelper.ok({
        message: `Instructions to reset your password were sent to ${fakeUser.personal.email}`
      })
    )
  })
})
