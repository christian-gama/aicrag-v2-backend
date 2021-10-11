import { ILogError, IUser, ISignUpUserData, ITask, ITaskData } from '@/domain'
import { LogErrorRepositoryProtocol, UserRepositoryProtocol } from '@/domain/repositories'
import { InvoiceRepositoryProtocol, QueryAllInvoicesProtocol, QueryInvoiceProtocol } from '@/domain/repositories/invoice'
import { TaskRepositoryProtocol } from '@/domain/repositories/task'

import { QueryResultProtocol } from '@/infra/database/protocols/queries-protocol'
import { TaskDbFilter } from '@/infra/database/protocols/update-task-options'
import { UserDbFilter } from '@/infra/database/protocols/update-user-options'

import { makeFakeLogError } from './mock-log-error'

export const makeLogErrorRepositoryStub = (error: Error): LogErrorRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorRepositoryProtocol {
    async saveLog (_error: Error): Promise<ILogError> {
      return await Promise.resolve(makeFakeLogError(error))
    }
  }

  return new LogErrorRepositoryStub()
}

export const makeInvoiceRepositoryStub = (fakeTask: ITask): InvoiceRepositoryProtocol => {
  class InvoiceRepositoryStub implements InvoiceRepositoryProtocol {
    async getAllInvoices<T extends ITask>(
      query: QueryAllInvoicesProtocol,
      userId: string
    ): Promise<QueryResultProtocol<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })) as QueryResultProtocol<T>
    }

    async getInvoiceByMonth<T extends ITask>(
      query: QueryInvoiceProtocol,
      userId: string
    ): Promise<QueryResultProtocol<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })) as QueryResultProtocol<T>
    }
  }

  return new InvoiceRepositoryStub()
}

export const makeTaskRepositoryStub = (fakeTask: ITask): TaskRepositoryProtocol => {
  class TaskRepositoryStub implements TaskRepositoryProtocol {
    async deleteTask (id: string, userId: string): Promise<boolean> {
      return await Promise.resolve(true)
    }

    async findAllTasks<T extends ITask>(userId: string): Promise<QueryResultProtocol<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
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

    async updateTask<T extends ITask | null>(id: string, update: TaskDbFilter): Promise<T> {
      return (await Promise.resolve(fakeTask)) as T
    }
  }

  return new TaskRepositoryStub()
}

export const makeUserRepositoryStub = (fakeUser: IUser): UserRepositoryProtocol => {
  class UserRepositoryStub implements UserRepositoryProtocol {
    async saveUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }

    async findUserByEmail (email: string): Promise<IUser | null> {
      return await Promise.resolve(fakeUser)
    }

    async findUserById (id: string): Promise<IUser | null> {
      return await Promise.resolve(fakeUser)
    }

    async updateUser<T extends IUser | null>(id: string, update: UserDbFilter): Promise<T> {
      return (await Promise.resolve(fakeUser)) as T
    }
  }

  return new UserRepositoryStub()
}
