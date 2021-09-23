import { IRefreshToken, GenerateTokenProtocol, VerifyTokenProtocol } from '@/application/protocols/providers'
import { IUser } from '@/domain'
import { makeFakeUser } from './mock-user'

import faker from 'faker'

export const makeFakeRefreshToken = (): IRefreshToken => {
  return {
    userId: faker.datatype.uuid(),
    version: 1
  }
}

export const makeGenerateTokenStub = (): GenerateTokenProtocol => {
  class GenerateTokenStub implements GenerateTokenProtocol {
    generate (user: any): string {
      return 'any_token'
    }
  }

  return new GenerateTokenStub()
}

export const makeVerifyTokenStub = (): VerifyTokenProtocol => {
  class VerifyTokenStub implements VerifyTokenProtocol {
    async verify (token: any): Promise<Error | IUser> {
      return makeFakeUser()
    }
  }

  return new VerifyTokenStub()
}
