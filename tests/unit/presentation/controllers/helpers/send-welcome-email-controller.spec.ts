import { IUser } from '@/domain'

import { SendWelcomeEmailController } from '@/presentation/controllers/helpers/send-welcome-email-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  sut: SendWelcomeEmailController
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = { body: { email: fakeUser.personal.email } }

  const sut = new SendWelcomeEmailController(httpHelper)

  return {
    sut,
    fakeUser,
    httpHelper,
    request
  }
}

describe('SendWelcomeEmailController', () => {
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
