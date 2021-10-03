import { ILogError, ISignUpUserCredentials, ITask, ITaskData, IUser } from '@/domain'
import { LogErrorRepositoryProtocol, TaskRepositoryProtocol, UserRepositoryProtocol } from '@/domain/repositories'

export const makeLogErrorRepositoryStub = (fakeLogError: ILogError): LogErrorRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorRepositoryProtocol {
    createLog (_error: Error): ILogError {
      return fakeLogError
    }
  }

  return new LogErrorRepositoryStub()
}

export const makeTaskRepositoryStub = (fakeTask: ITask): TaskRepositoryProtocol => {
  class TaskRepositoryStub implements TaskRepositoryProtocol {
    createTask (taskData: ITaskData): ITask {
      return fakeTask
    }
  }

  return new TaskRepositoryStub()
}

export const makeUserRepositoryStub = (fakeUser: IUser): UserRepositoryProtocol => {
  class UserRepositoryStub implements UserRepositoryProtocol {
    async createUser (signUpUserCredentials: ISignUpUserCredentials): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }
  }

  return new UserRepositoryStub()
}
