import { IUser } from '@/domain'
import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { makeFakeUser } from '../../domain/mock-user'

export const makeVerifyTokenStub = (): VerifyTokenProtocol => {
  class VerifyTokenStub implements VerifyTokenProtocol {
    async verify (token: any): Promise<Error | IUser> {
      return makeFakeUser()
    }
  }

  return new VerifyTokenStub()
}
