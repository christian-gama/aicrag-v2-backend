import { User, UserAccount } from '@/domain/user'
import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { AccountDbRepository } from '@/infra/database/mongodb/account/account-db-repository'
import { makeFakeUser } from '@/tests/domain/__mocks__/user-mock'

const makeAccountRepositoryStub = (fakeUser: User): AccountRepositoryProtocol => {
  class AccountRepositoryStub implements AccountRepositoryProtocol {
    async createAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }
  }

  return new AccountRepositoryStub()
}

interface SutTypes {
  sut: AccountDbRepository
  accountRepositoryStub: AccountRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accountRepositoryStub = makeAccountRepositoryStub(fakeUser)
  const sut = new AccountDbRepository(accountRepositoryStub)

  return { sut, accountRepositoryStub, fakeUser }
}
