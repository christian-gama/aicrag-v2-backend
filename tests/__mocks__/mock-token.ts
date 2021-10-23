import { IUser } from '@/domain'
import { IGenerateToken, IRefreshToken, IVerifyToken } from '@/domain/providers'

import { InvalidTokenError } from '@/application/errors'

import faker from 'faker'

export const makeFakeRefreshToken = (): IRefreshToken => {
  return {
    userId: faker.datatype.uuid(),
    version: 1
  }
}

export const makeGenerateTokenStub = (): IGenerateToken => {
  class GenerateTokenStub implements IGenerateToken {
    generate (user: any): string {
      return 'any_token'
    }
  }

  return new GenerateTokenStub()
}

export const makeVerifyTokenStub = (fakeUser: IUser): IVerifyToken => {
  class VerifyTokenStub implements IVerifyToken {
    async verify (token: any): Promise<InvalidTokenError | IUser> {
      return fakeUser
    }
  }

  return new VerifyTokenStub()
}
