import { ILogError, ISignUpUserData, ITask, ITaskData, IUser } from '@/domain'
import {
  CreateLogErrorRepositoryProtocol,
  CreateTaskRepositoryProtocol,
  CreateUserRepositoryProtocol
} from '@/domain/repositories'

export const makeCreateLogErrorRepositoryStub = (fakeLogError: ILogError): CreateLogErrorRepositoryProtocol => {
  class CreateLogErrorRepositoryStub implements CreateLogErrorRepositoryProtocol {
    createLog (_error: Error): ILogError {
      return fakeLogError
    }
  }

  return new CreateLogErrorRepositoryStub()
}

export const makeCreateTaskRepositoryStub = (fakeTask: ITask): CreateTaskRepositoryProtocol => {
  class CreateTaskRepositoryStub implements CreateTaskRepositoryProtocol {
    createTask (taskData: ITaskData): ITask {
      return fakeTask
    }
  }

  return new CreateTaskRepositoryStub()
}

export const makeCreateUserRepositoryStub = (fakeUser: IUser): CreateUserRepositoryProtocol => {
  class CreateUserRepositoryStub implements CreateUserRepositoryProtocol {
    async createUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }
  }

  return new CreateUserRepositoryStub()
}
