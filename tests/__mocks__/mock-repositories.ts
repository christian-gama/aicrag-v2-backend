import { ILogError, ISignUpUserCredentials, IUser } from '@/domain'
import { LogErrorRepositoryProtocol, UserRepositoryProtocol } from '@/domain/repositories'

export const makeLogErrorRepositoryStub = (fakeLogError: ILogError): LogErrorRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorRepositoryProtocol {
    createLog (_error: Error): ILogError {
      return fakeLogError
    }
  }

  return new LogErrorRepositoryStub()
}

export const makeUserRepositoryStub = (fakeUser: IUser): UserRepositoryProtocol => {
  class UserRepositoryStub implements UserRepositoryProtocol {
    async createUser (signUpUserCredentials: ISignUpUserCredentials): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }
  }

  return new UserRepositoryStub()
}
