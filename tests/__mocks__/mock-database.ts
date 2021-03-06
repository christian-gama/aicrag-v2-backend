import { ILogError, IUser, ISignUpUserData, ITask, ITaskData } from '@/domain'
import { ILogErrorRepository, IUserRepository } from '@/domain/repositories'
import {
  IAllInvoicesDocument,
  IInvoiceRepository,
  IQueryAllInvoices,
  IQueryInvoice
} from '@/domain/repositories/invoice'
import { ITaskRepository } from '@/domain/repositories/task'
import { IQuery, IQueryResult } from '@/infra/database/protocols/queries.model'
import { ITaskDbFilter } from '@/infra/database/protocols/update-task-options.model'
import { IUserDbFilter } from '@/infra/database/protocols/update-user-options.model'
import { makeFakeLogError } from './mock-log-error'

export const makeLogErrorRepositoryStub = (error: Error): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async save (_error: Error): Promise<ILogError> {
      return await Promise.resolve(makeFakeLogError(error))
    }
  }

  return new LogErrorRepositoryStub()
}

export const makeInvoiceRepositoryStub = (fakeTask: ITask): IInvoiceRepository => {
  class InvoiceRepositoryStub implements IInvoiceRepository {
    async getAll<T extends IAllInvoicesDocument>(query: IQueryAllInvoices, userId: string): Promise<IQueryResult<T>> {
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

    async getByMonth<T extends ITask>(query: IQueryInvoice, userId: string): Promise<IQueryResult<T>> {
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
    async deleteManyByUserId (userId: string): Promise<number> {
      return await Promise.resolve(1)
    }

    async deleteById (id: string, userId: string): Promise<boolean> {
      return await Promise.resolve(true)
    }

    async findAll<T extends ITask>(userId: string): Promise<IQueryResult<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [fakeTask],
        page: '1 of 1'
      })) as IQueryResult<T>
    }

    async findById (id: string, userId: string): Promise<ITask | null> {
      return await Promise.resolve(fakeTask)
    }

    async findByTaskId (taskId: string, userId: string): Promise<ITask | null> {
      return await Promise.resolve(fakeTask)
    }

    async save (taskData: ITaskData): Promise<ITask> {
      return await Promise.resolve(fakeTask)
    }

    async superFindById (id: string): Promise<ITask | null> {
      return await Promise.resolve(fakeTask)
    }

    async superUpdateById<T extends ITask | null>(id: string, update: ITaskDbFilter): Promise<T> {
      return (await Promise.resolve(fakeTask)) as T
    }

    async updateById<T extends ITask | null>(id: string, userId: string, update: ITaskDbFilter): Promise<T> {
      return (await Promise.resolve(fakeTask)) as T
    }
  }

  return new TaskRepositoryStub()
}

export const makeUserRepositoryStub = (fakeUser: IUser): IUserRepository => {
  class UserRepositoryStub implements IUserRepository {
    async deleteById (userId: string): Promise<boolean> {
      return true
    }

    async findAll<T extends IUser>(query: IQuery): Promise<IQueryResult<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [fakeUser],
        page: '1 of 1'
      })) as IQueryResult<T>
    }

    async findAllById<T extends IUser>(ids: string[], query: IQuery): Promise<IQueryResult<T>> {
      return (await Promise.resolve({
        count: 1,
        displaying: 1,
        documents: [fakeUser],
        page: '1 of 1'
      })) as IQueryResult<T>
    }

    async save (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }

    async findByEmail (email: string): Promise<IUser | null> {
      return await Promise.resolve(fakeUser)
    }

    async findById (id: string): Promise<IUser | null> {
      return await Promise.resolve(fakeUser)
    }

    async updateById<T extends IUser | null>(id: string, update: IUserDbFilter): Promise<T> {
      return (await Promise.resolve(fakeUser)) as T
    }
  }

  return new UserRepositoryStub()
}
