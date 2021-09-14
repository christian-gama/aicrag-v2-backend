import { User } from '@/domain/user'
import { RefreshTokenRepository } from '@/application/usecases/repositories/refresh-token/refresh-token-repository'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: RefreshTokenRepository
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const sut = new RefreshTokenRepository()

  return { sut, fakeUser }
}
