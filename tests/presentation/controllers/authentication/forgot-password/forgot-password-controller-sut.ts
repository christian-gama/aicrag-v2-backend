import { IUser } from '@/domain/user'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { ForgotPasswordController } from '@/presentation/controllers/authentication/forgot-password/forgot-password-controller'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'

interface SutTypes {
  sut: ForgotPasswordController
  fakeUser: IUser
  forgotPasswordValidatorStub: ValidatorProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const forgotPasswordValidatorStub = makeValidatorStub()
  const httpHelper = makeHttpHelper()
  const request = { body: { email: fakeUser.personal.email } }

  const sut = new ForgotPasswordController(forgotPasswordValidatorStub, httpHelper)

  return { sut, fakeUser, forgotPasswordValidatorStub, httpHelper, request }
}
