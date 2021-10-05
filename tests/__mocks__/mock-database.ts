import { ILogError, IUser, ISignUpUserData, ITask, ITaskData } from '@/domain'
import { LogErrorDbRepositoryProtocol, UserDbRepositoryProtocol } from '@/domain/repositories'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'

import { UserDbFilter } from '@/infra/database/protocols/update-user-options'

import { makeFakeLogError } from './mock-log-error'

export const makeLogErrorDbRepositoryStub = (error: Error): LogErrorDbRepositoryProtocol => {
  class LogErrorDbRepositoryStub implements LogErrorDbRepositoryProtocol {
    async saveLog (_error: Error): Promise<ILogError> {
      return await Promise.resolve(makeFakeLogError(error))
    }
  }

  return new LogErrorDbRepositoryStub()
}

export const makeTaskDbRepositoryStub = (fakeTask: ITask): TaskDbRepositoryProtocol => {
  class TaskDbRepositoryStub implements TaskDbRepositoryProtocol {
    async saveTask (taskData: ITaskData): Promise<ITask> {
      return await Promise.resolve(fakeTask)
    }

    async findTaskById (id: string, user: IUser): Promise<ITask | undefined> {
      return await Promise.resolve(fakeTask)
    }
  }

  return new TaskDbRepositoryStub()
}

export const makeUserDbRepositoryStub = (fakeUser: IUser): UserDbRepositoryProtocol => {
  class UserDbRepositoryStub implements UserDbRepositoryProtocol {
    async saveUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }

    async findUserByEmail (email: string): Promise<IUser | undefined> {
      return await Promise.resolve(fakeUser)
    }

    async findUserById (id: string): Promise<IUser | undefined> {
      return await Promise.resolve(fakeUser)
    }

    async updateUser <T extends IUser | undefined>(user: T, update: UserDbFilter): Promise<T> {
      return await Promise.resolve(fakeUser) as T
    }
  }

  return new UserDbRepositoryStub()
}
