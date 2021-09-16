import { User } from '@/domain/user'
import { HasherProtocol } from '@/application/protocols/cryptography'
import { RefreshTokenRepository } from '@/application/usecases/repositories/refresh-token/refresh-token-repository'
import { UuidProtocol } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeUuidStub } from '@/tests/__mocks__/application/helpers/mock-uuid'
import { makeHasherStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-bcrypt-adapter'

interface SutTypes {
  sut: RefreshTokenRepository
  fakeUser: User
  hasher: HasherProtocol
  uuidStub: UuidProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const hasher = makeHasherStub()
  const uuidStub = makeUuidStub()
  const sut = new RefreshTokenRepository(hasher, uuidStub)

  return { sut, fakeUser, hasher, uuidStub }
}
