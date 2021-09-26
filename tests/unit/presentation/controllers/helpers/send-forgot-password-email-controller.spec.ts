import { IUser } from '@/domain'

import { MailerServiceProtocol } from '@/application/protocols/mailer'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MailerServiceError } from '@/application/usecases/errors'

import { SendForgotPasswordEmailController } from '@/presentation/controllers/helpers'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import {
  makeFakeUser,
  makeValidatorStub,
  makeUserDbRepositoryStub,
  makeMailerServiceStub
} from '@/tests/__mocks__'

interface SutTypes {
  sut: SendForgotPasswordEmailController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  forgotPasswordValidatorStub: ValidatorProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
  forgotPasswordEmailStub: MailerServiceProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const forgotPasswordValidatorStub = makeValidatorStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)
  const forgotPasswordEmailStub = makeMailerServiceStub()

  const sut = new SendForgotPasswordEmailController(
    forgotPasswordEmailStub,
    forgotPasswordValidatorStub,
    httpHelper,
    userDbRepositoryStub
  )

  return {
    sut,
    fakeUser,
    httpHelper,
    request,
    forgotPasswordValidatorStub,
    userDbRepositoryStub,
    forgotPasswordEmailStub
  }
}

describe('SendForgotPasswordEmail', () => {
  it('Should call validate with correct credentials', async () => {
    const { sut, request, forgotPasswordValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(forgotPasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should return badRequest if validation fails', async () => {
    const { sut, httpHelper, request, forgotPasswordValidatorStub } = makeSut()
    jest
      .spyOn(forgotPasswordValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toEqual(httpHelper.badRequest(new Error()))
  })

  it('Should call findUserByEmail with correct email', async () => {
    const { sut, request, userDbRepositoryStub } = makeSut()
    const findUserByEmailSpy = jest.spyOn(userDbRepositoryStub, 'findUserByEmail')

    await sut.handle(request)

    expect(findUserByEmailSpy).toHaveBeenCalledWith(request.body.email)
  })

  it('Should call send with correct user', async () => {
    const { sut, fakeUser, request, forgotPasswordEmailStub } = makeSut()
    const sendSpy = jest.spyOn(forgotPasswordEmailStub, 'send')

    await sut.handle(request)

    expect(sendSpy).toHaveBeenCalledWith(fakeUser)
  })

  it('Should return serverError if mailer fails', async () => {
    const { sut, request, forgotPasswordEmailStub } = makeSut()
    jest
      .spyOn(forgotPasswordEmailStub, 'send')
      .mockReturnValueOnce(Promise.resolve(new MailerServiceError()))

    const response = await sut.handle(request)

    expect(response.data.error.name).toBe('MailerServiceError')
  })

  it('Should return ok if send email', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(
      httpHelper.ok({
        message: `Instructions to reset your password were sent to ${fakeUser.personal.email}`
      })
    )
  })
})
