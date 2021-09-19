import { IUser, SignUpUserCredentials } from '@/domain/user/index'
import { UserRepositoryProtocol } from '@/application/usecases/repositories/user'

export const makeUserRepositoryStub = (fakeUser: IUser): UserRepositoryProtocol => {
  class UserRepositoryStub implements UserRepositoryProtocol {
    async createUser (signUpUserCredentials: SignUpUserCredentials): Promise<IUser> {
      return Promise.resolve(fakeUser)
    }
  }

  return new UserRepositoryStub()
}
