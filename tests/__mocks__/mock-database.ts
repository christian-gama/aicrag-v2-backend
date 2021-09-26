import { ILogError, IUser, ISignUpUserCredentials } from '@/domain'

import { LogErrorDbRepositoryProtocol, UserDbRepositoryProtocol } from '@/application/protocols/repositories'

import { UserDbFilter } from '@/infra/database/mongodb/protocols/update-user-options'

import { makeFakeLogError } from './mock-log-error'

export const makeLogErrorDbRepositoryStub = (error: Error): LogErrorDbRepositoryProtocol => {
  class LogErrorDbRepositoryStub implements LogErrorDbRepositoryProtocol {
    async saveLog (_error: Error): Promise<ILogError> {
      return makeFakeLogError(error)
    }
  }

  return new LogErrorDbRepositoryStub()
}

export const makeUserDbRepositoryStub = (fakeUser: IUser): UserDbRepositoryProtocol => {
  class UserDbRepositoryStub implements UserDbRepositoryProtocol {
    async saveUser (signUpUserCredentials: ISignUpUserCredentials): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }

    async findUserByEmail (email: string): Promise<IUser | undefined> {
      return await Promise.resolve(fakeUser)
    }

    async findUserById (id: string): Promise<IUser | undefined> {
      return await Promise.resolve(fakeUser)
    }

    async updateUser (user: IUser, update: UserDbFilter): Promise<IUser | undefined> {
      return await Promise.resolve(fakeUser)
    }
  }

  return new UserDbRepositoryStub()
}
