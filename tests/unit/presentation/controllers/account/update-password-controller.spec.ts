import { IUser } from '@/domain'

import { HasherProtocol } from '@/application/protocols/cryptography'
import { ValidatorProtocol } from '@/application/protocols/validators'

import { UpdatePasswordController } from '@/presentation/controllers/account/update-password-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'

import { makeHttpHelper } from '@/main/factories/helpers'

import { makeFakeUser, makeHasherStub, makeValidatorStub } from '@/tests/__mocks__'

interface SutTypes {
  fakeUser: IUser
  hasherStub: HasherProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  sut: UpdatePasswordController
  updatePasswordValidatorStub: ValidatorProtocol
}

const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const hasherStub = makeHasherStub()
  const httpHelper = makeHttpHelper()
  const request: HttpRequest = {
    body: {
      email: fakeUser.personal.email,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
  }
  const updatePasswordValidatorStub = makeValidatorStub()

  const sut = new UpdatePasswordController(httpHelper, updatePasswordValidatorStub, hasherStub)

  return { fakeUser, hasherStub, httpHelper, request, sut, updatePasswordValidatorStub }
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
    jest
      .spyOn(updatePasswordValidatorStub, 'validate')
      .mockReturnValueOnce(Promise.resolve(new Error()))

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.badRequest(new Error()))
  })

  it('should call hash with correct password', async () => {
    expect.hasAssertions()

    const { hasherStub, request, sut } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    await sut.handle(request)

    expect(hashSpy).toHaveBeenCalledWith(request.body.password)
  })

  it('should return ok if succeds', async () => {
    expect.hasAssertions()

    const { httpHelper, request, sut } = makeSut()

    const response = await sut.handle(request)

    expect(response).toStrictEqual(httpHelper.ok({ user: 'filteredUser' }))
  })
})
