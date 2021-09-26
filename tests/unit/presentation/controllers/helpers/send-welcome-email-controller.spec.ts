import { IUser } from '@/domain'

import { ValidatorProtocol } from '@/application/protocols/validators'

import { SendWelcomeEmailController } from '@/presentation/controllers/helpers/send-welcome-email-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  sut: SendWelcomeEmailController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sendWelcomeValidatorStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }
  const sendWelcomeValidatorStub = makeValidatorStub()

  const sut = new SendWelcomeEmailController(httpHelper, sendWelcomeValidatorStub)

  return {
    sut,
    fakeUser,
    httpHelper,
    request,
    sendWelcomeValidatorStub
  }
}

describe('SendWelcomeEmailController', () => {
  it('Should call validate with correct credentials', async () => {
    const { sut, request, sendWelcomeValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(sendWelcomeValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
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
