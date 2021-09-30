import { IUser } from '@/domain'
import {
  GenerateTokenProtocol,
  IRefreshToken,
  VerifyTokenProtocol
} from '@/domain/providers'

import { InvalidTokenError } from '@/application/errors'

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

export const makeVerifyTokenStub = (fakeUser: IUser): VerifyTokenProtocol => {
  class VerifyTokenStub implements VerifyTokenProtocol {
    async verify (token: any): Promise<InvalidTokenError | IUser> {
      return fakeUser
    }
  }

  return new VerifyTokenStub()
}
