import { SignUpUserCredentials, IUser } from '@/domain/user/index'
import { UserDbRepositoryProtocol } from '@/infra/database/mongodb/user'
import { UserDbFilter } from '@/infra/database/mongodb/user/protocols/update-user-options'

export const makeUserDbRepositoryStub = (fakeUser: IUser): UserDbRepositoryProtocol => {
  class UserDbRepositoryStub implements UserDbRepositoryProtocol {
    async saveUser (signUpUserCredentials: SignUpUserCredentials): Promise<IUser> {
      return Promise.resolve(fakeUser)
    }

    async findUserByEmail (email: string): Promise<IUser | undefined> {
      return Promise.resolve(fakeUser)
    }

    async findUserById (id: string): Promise<IUser | undefined> {
      return Promise.resolve(fakeUser)
    }

    async findUserByRefreshToken (id: string): Promise<IUser | undefined> {
      return Promise.resolve(fakeUser)
    }

    async updateUser (user: IUser, update: UserDbFilter): Promise<IUser | undefined> {
      return Promise.resolve(fakeUser)
    }
  }

  return new UserDbRepositoryStub()
}
