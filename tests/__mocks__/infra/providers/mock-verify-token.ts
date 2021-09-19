import { IUser } from '@/domain/user/index'
import { VerifyTokenProtocol } from '@/infra/providers/token/protocols/verify-token-protocol'
import { makeFakeUser } from '../../domain/mock-user'

export const makeVerifyTokenStub = (): VerifyTokenProtocol => {
  class VerifyTokenStub implements VerifyTokenProtocol {
    async verify (token: any): Promise<Error | IUser> {
      return makeFakeUser()
    }
  }

  return new VerifyTokenStub()
}
