import { PublicUser, User, UserAccount } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ActivateAccountController } from '@/presentation/controllers/authentication/activate-account/activate-account-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helper/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeFakePublicUser } from '@/tests/domain/__mocks__/public-user-mock'
import { makeFakeUser } from '@/tests/domain/__mocks__/user-mock'

const makeAccountDbRepositoryStub = (fakeUser: User): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }

    async findAccountByEmail (email: string): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }
  }

  return new AccountDbRepositoryStub()
}

const makeActivateAccountValidatorStub = (): ValidatorProtocol => {
  class ActivateAccountValidatorStub implements ValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new ActivateAccountValidatorStub()
}

const makeJwtAdapterStub = (): EncrypterProtocol => {
  class JwtAdapterStub implements EncrypterProtocol {
    encryptId (id: string): string {
      return 'any_token'
    }
  }

  return new JwtAdapterStub()
}

export interface SutTypes {
  sut: ActivateAccountController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  activateAccountValidatorStub: ValidatorProtocol
  fakePublicUser: PublicUser
  fakeUser: User
  httpHelper: HttpHelperProtocol
  jwtAdapterStub: EncrypterProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const activateAccountValidatorStub = makeActivateAccountValidatorStub()
  const httpHelper = makeHttpHelper()
  const jwtAdapterStub = makeJwtAdapterStub()
  const request = {
    body: {
      email: fakeUser.personal.email,
      activationCode: fakeUser.temporary?.activationCode
    }
  }
  const sut = new ActivateAccountController(activateAccountValidatorStub, httpHelper)

  return {
    sut,
    accountDbRepositoryStub,
    activateAccountValidatorStub,
    fakePublicUser,
    fakeUser,
    httpHelper,
    jwtAdapterStub,
    request
  }
}
