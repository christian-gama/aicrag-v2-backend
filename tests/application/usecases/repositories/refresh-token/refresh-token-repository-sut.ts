import { User } from '@/domain/user'
import { RefreshTokenRepository } from '@/application/usecases/repositories/refresh-token/refresh-token-repository'
import { UuidProtocol } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeUuidStub } from '@/tests/__mocks__/application/helpers/mock-uuid'

interface SutTypes {
  sut: RefreshTokenRepository
  fakeUser: User
  uuidStub: UuidProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const uuidStub = makeUuidStub()
  const sut = new RefreshTokenRepository(uuidStub)

  return { sut, fakeUser, uuidStub }
}
