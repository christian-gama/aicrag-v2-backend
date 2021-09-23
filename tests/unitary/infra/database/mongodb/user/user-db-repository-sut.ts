import { IUser } from '@/domain'
import { UserRepositoryProtocol } from '@/application/protocols/repositories/user/user-repository-protocol'
import { UserDbRepository } from '@/infra/database/mongodb/user/user-db-repository'
import { makeUserRepositoryStub } from '@/tests/__mocks__/application/repositories/user/mock-user-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: UserDbRepository
  fakeUser: IUser
  userRepositoryStub: UserRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const userRepositoryStub = makeUserRepositoryStub(fakeUser)
  const sut = new UserDbRepository(userRepositoryStub)

  return { sut, fakeUser, userRepositoryStub }
}
