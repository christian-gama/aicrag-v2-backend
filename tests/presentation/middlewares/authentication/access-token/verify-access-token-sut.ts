import { User } from '@/domain/user/'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { HttpHelperProtocol, HttpRequestToken } from '@/presentation/helpers/http/protocols'
import { VerifyAccessToken } from '@/presentation/middlewares/authentication/access-token/'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import {
  makeJwtAdapterStub
} from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { UserDbRepositoryProtocol } from '@/infra/database/mongodb/user'
interface SutTypes {
  sut: VerifyAccessToken
  fakeRefreshToken: RefreshToken
  fakeUser: User
  httpHelper: HttpHelperProtocol
  jwtAccessToken: EncrypterProtocol & DecoderProtocol
  request: HttpRequestToken
  userDbRepositoryStub: UserDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAdapterStub()
  const request: HttpRequestToken = { accessToken: 'any_token' }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new VerifyAccessToken(
    httpHelper,
    jwtAccessToken,
    userDbRepositoryStub
  )

  return {
    sut,
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    jwtAccessToken,
    request,
    userDbRepositoryStub
  }
}
