import { ILogError, ISignUpUserData, ITask, ITaskData, IUser } from '@/domain'
import { ICreateLogErrorRepository, ICreateTaskRepository, ICreateUserRepository } from '@/domain/repositories'

export const makeCreateLogErrorRepositoryStub = (fakeLogError: ILogError): ICreateLogErrorRepository => {
  class CreateLogErrorRepositoryStub implements ICreateLogErrorRepository {
    create (_error: Error): ILogError {
      return fakeLogError
    }
  }

  return new CreateLogErrorRepositoryStub()
}

export const makeCreateTaskRepositoryStub = (fakeTask: ITask): ICreateTaskRepository => {
  class CreateTaskRepositoryStub implements ICreateTaskRepository {
    create (taskData: ITaskData): ITask {
      return fakeTask
    }
  }

  return new CreateTaskRepositoryStub()
}

export const makeCreateUserRepositoryStub = (fakeUser: IUser): ICreateUserRepository => {
  class CreateUserRepositoryStub implements ICreateUserRepository {
    async createUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
      return await Promise.resolve(fakeUser)
    }
  }

  return new CreateUserRepositoryStub()
}
