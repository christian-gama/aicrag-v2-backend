import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { User } from '@/domain/user'
import { HttpHelper } from '@/presentation/http/helper/http-helper'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'
import { LoginController } from '@/presentation/controllers/login/login-controller'

const makeCredentialsValidatorStub = (): ValidatorProtocol => {
  class CredentialsValidatorStub implements ValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new CredentialsValidatorStub()
}

export interface SutTypes {
  sut: LoginController
  credentialsValidatorStub: ValidatorProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const credentialsValidatorStub = makeCredentialsValidatorStub()
  const httpHelper = new HttpHelper()
  const request = {
    body: {
      email: fakeUser.personal.email,
      password: fakeUser.personal.password
    }
  }
  const sut = new LoginController(credentialsValidatorStub, httpHelper)

  return { sut, credentialsValidatorStub, httpHelper, request, fakeUser }
}
