import { IUser } from '@/domain'

import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'

import { SendWelcomeEmailController } from '@/presentation/controllers/helpers/send-welcome-email-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser, makeValidatorStub, makeUserDbRepositoryStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: SendWelcomeEmailController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sendWelcomeValidatorStub: ValidatorProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const sendWelcomeValidatorStub = makeValidatorStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new SendWelcomeEmailController(
    httpHelper,
    sendWelcomeValidatorStub,
    userDbRepositoryStub
  )

  return {
    sut,
    fakeUser,
    httpHelper,
    request,
    sendWelcomeValidatorStub,
    userDbRepositoryStub
  }
}

describe('SendWelcomeEmailController', () => {
  it('Should call validate with correct credentials', async () => {
    const { sut, request, sendWelcomeValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(sendWelcomeValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('Should return badRequest if validation fails', async () => {
    const { sut, httpHelper, request, sendWelcomeValidatorStub } = makeSut()
    jest
      .spyOn(sendWelcomeValidatorStub, 'validate')
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

  it('Should return ok if send email', async () => {
    const { sut, fakeUser, httpHelper, request } = makeSut()

    const response = await sut.handle(request)

    expect(response).toEqual(
      httpHelper.ok({
        message: `A welcome email with activation code has been sent to ${fakeUser.personal.email}`
      })
    )
  })
})
