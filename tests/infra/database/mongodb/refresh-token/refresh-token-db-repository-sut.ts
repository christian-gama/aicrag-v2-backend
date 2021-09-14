import { User } from '@/domain/user'
import { RefreshTokenRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-repository-protocol'
import { RefreshTokenDbRepository } from '@/infra/database/mongodb/refresh-token/refresh-token-db-repository'
import { makeRefreshTokenRepositoryStub } from '@/tests/__mocks__/application/repositories/refresh-token/mock-refresh-token-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: RefreshTokenDbRepository
  fakeUser: User
  refreshTokenRepositoryStub: RefreshTokenRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const refreshTokenRepositoryStub = makeRefreshTokenRepositoryStub()
  const sut = new RefreshTokenDbRepository(refreshTokenRepositoryStub)

  return { sut, fakeUser, refreshTokenRepositoryStub }
}
