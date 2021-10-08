import { ILogError, IUser, ISignUpUserData, ITask, ITaskData } from '@/domain'
import { LogErrorDbRepositoryProtocol, UserDbRepositoryProtocol } from '@/domain/repositories'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'

import { QueryResultProtocol } from '@/infra/database/protocols/queries-protocol'
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
    async findAllTasks<T extends ITask>(userId: string): Promise<QueryResultProtocol<T>> {
      return (await Promise.resolve({
        count: 1,
        currentPage: 1,
        documents: [fakeTask],
        totalPages: 1
      })) as QueryResultProtocol<T>
    }

    async findTaskById (id: string, userId: string): Promise<ITask | null> {
      return await Promise.resolve(fakeTask)
    }

    async findTaskByTaskId (taskId: string, userId: string): Promise<ITask | null> {
      return await Promise.resolve(fakeTask)
    }

    async saveTask (taskData: ITaskData): Promise<ITask> {
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

    async findUserByEmail (email: string): Promise<IUser | null> {
      return await Promise.resolve(fakeUser)
    }

    async findUserById (id: string): Promise<IUser | null> {
      return await Promise.resolve(fakeUser)
    }

    async updateUser<T extends IUser | null>(user: T, update: UserDbFilter): Promise<T> {
      return (await Promise.resolve(fakeUser)) as T
    }
  }

  return new UserDbRepositoryStub()
}
