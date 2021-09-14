import { User } from '@/domain/user'
import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { AccountDbRepository } from '@/infra/database/mongodb/account/account-db-repository'
import { makeAccountRepositoryStub } from '@/tests/__mocks__/application/repositories/account/mock-account-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

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
