import { SignUpUserCredentials, User } from '@/domain/user'
import { UserDbRepositoryProtocol } from '@/infra/database/mongodb/user'
import { UserDbFilter } from '@/infra/database/mongodb/user/protocols/update-user-options'

export const makeUserDbRepositoryStub = (fakeUser: User): UserDbRepositoryProtocol => {
  class UserDbRepositoryStub implements UserDbRepositoryProtocol {
    async saveUser (signUpUserCredentials: SignUpUserCredentials): Promise<User> {
      return Promise.resolve(fakeUser)
    }

    async findUserByEmail (email: string): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }

    async updateUser (user: User, update: UserDbFilter): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }
  }

  return new UserDbRepositoryStub()
}
