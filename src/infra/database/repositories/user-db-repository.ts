import { ISignUpUserData, IUser } from '@/domain'
import { UserDbRepositoryProtocol, UserRepositoryProtocol } from '@/domain/repositories'

import { DatabaseProtocol, UserDbFilter } from '../protocols'

export class UserDbRepository implements UserDbRepositoryProtocol {
  constructor (
    private readonly database: DatabaseProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async findUserByEmail (email: string): Promise<IUser | null> {
    const userCollection = this.database.collection('users')

    const filter: UserDbFilter = { 'personal.email': email.toLowerCase() }
    const user = await userCollection.findOne<IUser>(filter)

    return user
  }

  async findUserById (id: string): Promise<IUser | null> {
    const userCollection = this.database.collection('users')

    const filter: UserDbFilter = { 'personal.id': id }
    const user = await userCollection.findOne<IUser>(filter)

    return user
  }

  async saveUser (signUpUserCredentials: ISignUpUserData): Promise<IUser> {
    const userCollection = this.database.collection('users')

    const user = await this.userRepository.createUser(signUpUserCredentials)

    return await userCollection.insertOne(user)
  }

  async updateUser <T extends IUser | null>(user: T, update: UserDbFilter): Promise<T> {
    const userCollection = this.database.collection('users')

    const filter = { 'personal.id': user?.personal.id }
    const updatedUser = await userCollection.updateOne<IUser>(filter, update)

    return updatedUser as T
  }
}
