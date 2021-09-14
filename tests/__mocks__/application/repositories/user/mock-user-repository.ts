import { User, SignUpUserCredentials } from '@/domain/user'
import { UserRepositoryProtocol } from '@/application/usecases/repositories/user'

export const makeUserRepositoryStub = (fakeUser: User): UserRepositoryProtocol => {
  class UserRepositoryStub implements UserRepositoryProtocol {
    async createUser (signUpUserCredentials: SignUpUserCredentials): Promise<User> {
      return Promise.resolve(fakeUser)
    }
  }

  return new UserRepositoryStub()
}
