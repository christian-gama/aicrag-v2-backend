import { IUser } from '@/domain'

import { ValidatorProtocol } from '@/application/protocols/validators'

import { UpdatePasswordController } from '@/presentation/controllers/account/update-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdatePasswordController
  updatePasswordValidatorStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = {
    body: { password: fakeUser.personal.password, passwordConfirmation: fakeUser.personal.password }
  }
  const updatePasswordValidatorStub = makeValidatorStub()

  const sut = new UpdatePasswordController(httpHelper, updatePasswordValidatorStub)

  return { fakeUser, httpHelper, request, sut, updatePasswordValidatorStub }
}

describe('updatePasswordController', () => {
  it('should call validate with correct credentials', async () => {
    expect.hasAssertions()

    const { request, sut, updatePasswordValidatorStub } = makeSut()
    const validateSpy = jest.spyOn(updatePasswordValidatorStub, 'validate')

    await sut.handle(request)

    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })

  it('should return badRequest if validation fails', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut, updatePasswordValidatorStub } = makeSut()
    jest.spyOn(updatePasswordValidatorStub, 'validate').mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should return ok if succeds', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ user: 'filteredUser' }))
  })
})
