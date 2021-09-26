import { IUser } from '@/domain'

import { UpdatePasswordController } from '@/presentation/controllers/account/update-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdatePasswordController
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = {
    body: { password: fakeUser.personal.password, passwordConfirmation: fakeUser.personal.password }
  }

  const sut = new UpdatePasswordController(httpHelper)

  return { fakeUser, httpHelper, request, sut }
}

describe('updatePasswordController', () => {
  it('should return ok if succeds', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ user: 'filteredUser' }))
  })
})
