import { IUser, ISignUpUserCredentials } from '@/domain/user'
import { UserRepositoryProtocol } from '@/application/protocols/repositories'

export const makeUserRepositoryStub = (fakeUser: IUser): UserRepositoryProtocol => {
  class UserRepositoryStub implements UserRepositoryProtocol {
    async createUser (signUpUserCredentials: ISignUpUserCredentials): Promise<IUser> {
      return Promise.resolve(fakeUser)
    }
  }

  return new UserRepositoryStub()
}
