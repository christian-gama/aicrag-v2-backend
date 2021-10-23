import { ILogError, IUser, ISignUpUserData, ITask, ITaskData } from '@/domain'
import { ILogErrorRepository, IUserRepository } from '@/domain/repositories'
import {
  IAllInvoicesDocument,
  IInvoiceRepository,
  IQueryAllInvoices,
  IQueryInvoice
} from '@/domain/repositories/invoice'
import { ITaskRepository } from '@/domain/repositories/task'

import { IQueryResult } from '@/infra/database/protocols/queries-protocol'
import { ITaskDbFilter } from '@/infra/database/protocols/update-task-options'
import { IUserDbFilter } from '@/infra/database/protocols/update-user-options'

import { makeFakeLogError } from './mock-log-error'

export const makeLogErrorRepositoryStub = (error: Error): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async saveLog (_error: Error): Promise<ILogError> {
      return await Promise.resolve(makeFakeLogError(error))
    }
  }

  return new LogErrorRepositoryStub()
}

export const makeInvoiceRepositoryStub = (fakeTask: ITask): IInvoiceRepository => {
  class InvoiceRepositoryStub implements IInvoiceRepository {
    async getAllInvoices<T extends IAllInvoicesDocument>(
      query: IQueryAllInvoices,
      userId: string
    ): Promise<IQueryResult<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [
          {
            date: { month: fakeTask.date.month, year: fakeTask.date.year },
            tasks: 1,
            totalUsd: fakeTask.usd
          }
        ],
        page: '1 of 1'
      })) as IQueryResult<T>
    }

    async getInvoiceByMonth<T extends ITask>(query: IQueryInvoice, userId: string): Promise<IQueryResult<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })) as IQueryResult<T>
    }
  }

  return new InvoiceRepositoryStub()
}

export const makeTaskRepositoryStub = (fakeTask: ITask): ITaskRepository => {
  class TaskRepositoryStub implements ITaskRepository {
    async deleteTask (id: string, userId: string): Promise<boolean> {
      return await Promise.resolve(true)
    }

    async findAllTasks<T extends ITask>(userId: string): Promise<IQueryResult<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })) as IQueryResult<T>
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

    async updateTask<T extends ITask | null>(id: string, update: ITaskDbFilter): Promise<T> {
      return (await Promise.resolve(fakeTask)) as T
    }
  }

  return new TaskRepositoryStub()
}

export const makeUserRepositoryStub = (fakeUser: IUser): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async saveUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }

    async findUserByEmail (email: string): Promise<IUser | null> {
      return await Promise.resolve(fakeUser)
    }

    async findUserById (id: string): Promise<IUser | null> {
      return await Promise.resolve(fakeUser)
    }

    async updateUser<T extends IUser | null>(id: string, update: IUserDbFilter): Promise<T> {
      return (await Promise.resolve(fakeUser)) as T
    }
  }

  return new UserRepositoryStub()
}
