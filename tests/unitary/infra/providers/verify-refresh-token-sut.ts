import { IRefreshToken } from '@/application/protocols/providers/refresh-token-protocol'
import { IUser } from '@/domain/user'
import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { VerifyRefreshToken } from '@/infra/providers/token/verify-refresh-token'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeDecoderStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'

interface SutTypes {
  sut: VerifyRefreshToken
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  jwtRefreshTokenStub: DecoderProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const jwtRefreshTokenStub = makeDecoderStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyRefreshToken(jwtRefreshTokenStub, userDbRepositoryStub)

  return { sut, fakeRefreshToken, fakeUser, jwtRefreshTokenStub, userDbRepositoryStub }
}
