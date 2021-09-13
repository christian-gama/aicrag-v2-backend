import { User, UserAccount } from '@/domain/user'
import { UpdateUserOptions } from '@/infra/database/mongodb/account/protocols/update-user-options'
import { ValidateActivationCode } from '@/application/usecases/validators/codes/validate-activation-code'
import { AccountDbRepositoryProtocol } from '@/infra/database/mongodb/account'
import { makeFakeUser } from '@/tests/domain/__mocks__/user-mock'

const fakeUser = makeFakeUser()
const makeAccountDbRepositoryStub = (): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }

    async findAccountByEmail (email: string): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }

    async updateUser (user: User, update: UpdateUserOptions): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }
  }

  return new AccountDbRepositoryStub()
}

interface SutTypes {
  sut: ValidateActivationCode
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const accountDbRepositoryStub = makeAccountDbRepositoryStub()
  const sut = new ValidateActivationCode(accountDbRepositoryStub)

  return { sut, accountDbRepositoryStub, fakeUser }
}
