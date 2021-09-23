import { IUser } from '@/domain'
import { DecoderProtocol } from '@/application/protocols/cryptography'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { VerifyAccessToken } from '@/infra/providers/token/verify-access-token'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeDecoderStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'

interface SutTypes {
  sut: VerifyAccessToken
  fakeUser: IUser
  jwtAccessTokenStub: DecoderProtocol
  userDbRepositoryStub: UserDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const jwtAccessTokenStub = makeDecoderStub()
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyAccessToken(jwtAccessTokenStub, userDbRepositoryStub)

  return { sut, fakeUser, jwtAccessTokenStub, userDbRepositoryStub }
}
